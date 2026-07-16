const mongoose = require('mongoose');
const Review = require('../models/Review');
const Food = require('../models/Food');
const Order = require('../models/Order');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// =====================================
// Create Review
// =====================================
exports.createReview = async (req, res, next) => {
  try {
    const { foodId, rating, comment } = req.body;

    if (!isValidObjectId(foodId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid food ID',
      });
    }

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found',
      });
    }

    const purchased = await Order.findOne({
      customer: req.user._id,
      'items.food': foodId,
      orderStatus: 'Delivered',
    });

    if (!purchased) {
      return res.status(403).json({
        success: false,
        message: 'You can only review delivered foods',
      });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      food: foodId,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this food',
      });
    }

    const review = await Review.create({
      user: req.user._id,
      food: foodId,
      rating,
      comment,
    });

    const stats = await Review.aggregate([
      {
        $match: {
          food: new mongoose.Types.ObjectId(foodId),
        },
      },
      {
        $group: {
          _id: '$food',
          averageRating: { $avg: '$rating' },
        },
      },
    ]);

    await Food.findByIdAndUpdate(foodId, {
      ratings: Number((stats[0]?.averageRating || 0).toFixed(1)),
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

// =====================================
// Get Reviews By Food
// =====================================
exports.getReviewsByFood = async (req, res, next) => {
  try {
    const { foodId } = req.params;

    if (!isValidObjectId(foodId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid food ID',
      });
    }

    const reviews = await Review.find({
      food: foodId,
    })
      .populate('user', 'fullName')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      message: 'Reviews fetched successfully',
      data: { reviews },
    });
  } catch (error) {
    next(error);
  }
};

// =====================================
// Delete Review
// =====================================
exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID',
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const foodId = review.food;

    await review.deleteOne();

    const stats = await Review.aggregate([
      {
        $match: {
          food: foodId,
        },
      },
      {
        $group: {
          _id: '$food',
          averageRating: { $avg: '$rating' },
        },
      },
    ]);

    await Food.findByIdAndUpdate(foodId, {
      ratings: Number((stats[0]?.averageRating || 0).toFixed(1)),
    });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};