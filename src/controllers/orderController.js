
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { processPayment } = require('../services/paymentService');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const allowedPaymentMethods = [
  'cash_on_delivery',
  'card',
  'mobile_money',
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
  try {
    const paymentMethod =
      req.body.paymentMethod || 'cash_on_delivery';

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method',
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate('items.food');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    const deliveryAddress =
      req.body.deliveryAddress || req.user.address;

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required',
      });
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const deliveryFee = subtotal > 0 ? 5 : 0;
    const total = subtotal + deliveryFee;

    const payment = processPayment(paymentMethod, total);

    const order = await Order.create({
      customer: req.user._id,
      items: cart.items.map((item) => ({
        food: item.food._id,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      deliveryFee,
      total,
      deliveryAddress,
      paymentMethod,
      paymentStatus: payment.status,
    });

    await Cart.findByIdAndDelete(cart._id);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order },
    });
  } catch (error) {
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

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
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
