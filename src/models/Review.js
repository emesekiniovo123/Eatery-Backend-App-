//Import Schema and model from mongoose
const { Schema, model } = require('mongoose');

// =====================================
// Review Schema
// =====================================
const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },

    //Identifies the food ID being reviewed
    food: {
      type: Schema.Types.ObjectId,
      ref: 'Food',
      required: [true, 'Food is required'],
      index: true,
    },
// Rating:  min = 1, max = 5.This keep five-stars standard scale
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be greater than 5'],
    },
//Comments store customers feedback about the food.
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// =====================================
// Prevent Duplicate Reviews
// =====================================
reviewSchema.index(
  { user: 1, food: 1 },
  { unique: true }
);

// =====================================
// Performance Indexes
// =====================================
reviewSchema.index({ food: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });

// =====================================
// Export Model
// =====================================
module.exports = model('Review', reviewSchema);


