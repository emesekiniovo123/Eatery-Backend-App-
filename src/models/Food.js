
const mongoose = require('mongoose');

// =====================================
// Food Schema
// =====================================
const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
      maxlength: [100, 'Food name cannot exceed 100 characters'],
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,

      // Uncomment if your categories are fixed
      // enum: [
      //   'Pizza',
      //   'Burger',
      //   'Rice',
      //   'Pasta',
      //   'Drink',
      //   'Dessert',
      //   'Salad',
      // ],
    },

    image: {
      type: String,
      default: '',
      trim: true,
    },

    secondaryImage: {
      type: String,
      default: '',
      trim: true,
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },

    available: {
      type: Boolean,
      default: true,
    },

    isAvailable: {
      type: Boolean,
    },

    ingredients: {
      type: [String],
      default: [],
    },

    preparationTime: {
      type: Number,
      default: 15,
      min: [1, 'Preparation time must be at least 1 minute'],
    },

    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// =====================================
// Round Price and Ratings
// =====================================
foodSchema.pre('save', function (next) {
  this.price = Number(this.price.toFixed(2));
  this.ratings = Number(this.ratings.toFixed(1));
  next();
});

// =====================================
// Export Model
// =====================================
module.exports = mongoose.model('Food', foodSchema);

