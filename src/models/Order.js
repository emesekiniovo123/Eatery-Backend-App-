
const mongoose = require('mongoose');

// =====================================
// Order Item Schema
// =====================================
const orderItemSchema = new mongoose.Schema(
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
// Order Schema
// =====================================
const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
      index: true,
    },

    items: {
      type: [orderItemSchema],
      validate: {
        validator(items) {
          return items.length > 0;
        },
        message: 'Order must contain at least one item.',
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryFee: {
      type: Number,
      default: 5,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryAddress: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true,
    },

    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'stripe', 'paypal'],
      default: 'cash_on_delivery',
    },

    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },

    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Preparing',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Pending',
      index: true,
    },

    statusHistory: {
      type: [
        {
          status: {
            type: String,
            enum: [
              'Pending',
              'Preparing',
              'Out for Delivery',
              'Delivered',
              'Cancelled',
            ],
            required: true,
          },
          changedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: function () {
        return [{ status: this.orderStatus || 'Pending' }];
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// =====================================
// Round Monetary Values
// =====================================
orderSchema.pre('save', function (next) {
  this.subtotal = Number(this.subtotal.toFixed(2));
  this.deliveryFee = Number(this.deliveryFee.toFixed(2));
  this.total = Number(this.total.toFixed(2));
  next();
});

// =====================================
// Compound Indexes
// =====================================
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });

// =====================================
// Export Model
// =====================================
module.exports = mongoose.model('Order', orderSchema);

