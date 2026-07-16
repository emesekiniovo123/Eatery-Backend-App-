// Import modules
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Food = require('../models/Food');

// Calculate total cart price
const calculateTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

// ==============================
// Get User Cart
// ==============================
exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.food');

    res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      data: {
        cart: cart || {
          items: [],
          totalPrice: 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Add Item to Cart
// ==============================
exports.addToCart = async (req, res, next) => {
  try {
    const { foodId } = req.body;
    const quantity = Number(req.body.quantity || 1);

    // Validate food ID
    if (!mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid food ID',
      });
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive integer',
      });
    }

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found',
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
        totalPrice: 0,
      });
    }

    const existingItem = cart.items.find(
      (item) => item.food.toString() === food._id.toString()
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = food.price;
    } else {
      cart.items.push({
        food: food._id,
        quantity,
        price: food.price,
      });
    }

    cart.totalPrice = calculateTotal(cart.items);

    await cart.save();
    await cart.populate('items.food');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Update Cart Item Quantity
// ==============================
exports.updateCart = async (req, res, next) => {
  try {
    const { foodId, quantity } = req.body;

    // Validate food ID
    if (!mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid food ID',
      });
    }

    // Validate quantity
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive integer',
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.find(
      (item) => item.food.toString() === foodId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    item.quantity = Number(quantity);

    cart.totalPrice = calculateTotal(cart.items);

    await cart.save();
    await cart.populate('items.food');

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Remove Item from Cart
// ==============================
exports.removeItem = async (req, res, next) => {
  try {
    const { foodId } = req.params;

    // Validate food ID
    if (!mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid food ID',
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      (item) => item.food.toString() !== foodId
    );

    cart.totalPrice = calculateTotal(cart.items);

    await cart.save();
    await cart.populate('items.food');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Clear Cart
// ==============================
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    next(error);
  }
};