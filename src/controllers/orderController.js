
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Food = require('../models/Food');
const { processPayment } = require('../services/paymentService');
const { recordActivity } = require('../utils/activityLogger');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const allowedPaymentMethods = [
  'cash_on_delivery',
  'stripe',
  'paypal',
];

const allowedOrderStatuses = [
  'Pending',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

// =====================================
// Create Order
// =====================================
exports.createOrder = async (req, res, next) => {
  let session;

  try {
    const paymentMethod =
      req.body.paymentMethod || 'cash_on_delivery';

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method',
      });
    }

    const deliveryAddress =
      req.body.deliveryAddress || req.user.address;
    const phone = req.body.phone || req.user.phone;
    const email = req.user.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required',
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      });
    }

    session = await mongoose.startSession();
    let order;

    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ user: req.user._id }).session(session);

      if (!cart || cart.items.length === 0) {
        const error = new Error('Cart is empty');
        error.statusCode = 400;
        throw error;
      }

      const foodIds = cart.items.map((item) => item.food.toString());
      const foods = await Food.find({ _id: { $in: foodIds } }).session(session);
      const foodById = new Map(foods.map((food) => [food._id.toString(), food]));

      const orderItems = cart.items.map((item) => {
        const food = foodById.get(item.food.toString());

        if (!food) {
          const error = new Error('One or more cart items no longer exist');
          error.statusCode = 400;
          throw error;
        }

        const isAvailable = food.isAvailable ?? food.available;

        if (isAvailable !== true) {
          const error = new Error(`Food item "${food.name}" is currently unavailable`);
          error.statusCode = 400;
          throw error;
        }

        return {
          food: food._id,
          quantity: item.quantity,
          price: food.price,
        };
      });

      const subtotal = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const deliveryFee = paymentMethod === 'cash_on_delivery' && subtotal > 0 ? 5 : 0;
      const total = subtotal + deliveryFee;
      const payment = processPayment(paymentMethod, total);

      [order] = await Order.create([{
        customer: req.user._id,
        items: orderItems,
        subtotal,
        deliveryFee,
        total,
        deliveryAddress,
        phone,
        email,
        paymentMethod,
        paymentStatus: payment.status,
      }], { session });

      await Cart.deleteOne({ _id: cart._id }).session(session);
    });

    await session.endSession();
    await recordActivity({ user: req.user, action: 'order_created', resourceType: 'Order', resourceId: order._id, metadata: { paymentMethod, total: order.total } });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order },
    });
  } catch (error) {
    if (session) {
      await session.endSession().catch(() => {});
    }
    next(error);
  }
};

// =====================================
// Get Orders
// =====================================
exports.getOrders = async (req, res, next) => {
  try {
    const query =
      req.user.role === 'admin'
        ? {}
        : { customer: req.user._id };

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('customer', 'fullName email')
      .populate('items.food')
      .lean();

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

// =====================================
// Get My Orders
// =====================================
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      customer: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate('customer', 'fullName email')
      .populate('items.food')
      .lean();

    res.status(200).json({
      success: true,
      message: 'My orders fetched successfully',
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

// =====================================
// Get Order By ID
// =====================================
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID',
      });
    }

    const order = await Order.findById(id)
      .populate('customer', 'fullName email')
      .populate('items.food')
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (
      req.user.role !== 'admin' &&
      order.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

// =====================================
// Update Order Status
// =====================================
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID',
      });
    }

    if (!allowedOrderStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status',
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.orderStatus !== status) {
      order.orderStatus = status;
      order.statusHistory.push({ status });
      await order.save();
      await recordActivity({ user: req.user, action: 'order_status_changed', resourceType: 'Order', resourceId: order._id, metadata: { status } });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

// =====================================
// Delete Order
// =====================================
exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID',
      });
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
