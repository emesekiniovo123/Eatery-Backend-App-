
const mongoose = require('mongoose');

// =====================================
// Cart Item Schema
// =====================================
const cartItemSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: [true, 'Food is required'],
    },

    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
  },
  {
    _id: false,
  }
);

// =====================================
// Cart Schema
// =====================================
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },

    totalPrice: {
      type: Number,
      default: 0,
      min: [0, 'Total price cannot be negative'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// =====================================
// Round Total Price Before Saving
// =====================================
cartSchema.pre('save', function (next) {
  this.totalPrice = Number(this.totalPrice.toFixed(2));
  next();
});

// =====================================
// Export Model
// =====================================
module.exports = mongoose.model('Cart', cartSchema);


