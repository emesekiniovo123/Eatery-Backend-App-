const mongoose = require('mongoose');
const User = require('../models/User');
const Food = require('../models/Food');

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Favorites fetched successfully',
      data: { favorites: user.favorites || [] },
    });
  } catch (error) {
    next(error);
  }
};

exports.addFavorite = async (req, res, next) => {
  try {
    const foodId = req.params.foodId;

    if (!isValidObjectId(foodId)) {
      return res.status(400).json({ success: false, message: 'Invalid food ID' });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const alreadyFavorited = user.favorites.some((favoriteId) => favoriteId?.toString() === food._id.toString());

    if (!alreadyFavorited) {
      user.favorites.push(food._id);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: alreadyFavorited ? 'Food is already in favorites' : 'Food added to favorites',
      data: { favorites: user.favorites },
    });
  } catch (error) {
    next(error);
  }
};

exports.removeFavorite = async (req, res, next) => {
  try {
    const foodId = req.params.foodId;

    if (!isValidObjectId(foodId)) {
      return res.status(400).json({ success: false, message: 'Invalid food ID' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const initialCount = user.favorites.length;
    user.favorites = user.favorites.filter((favoriteId) => favoriteId?.toString() !== foodId);

    if (user.favorites.length === initialCount) {
      return res.status(404).json({ success: false, message: 'Food not found in favorites' });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Food removed from favorites',
      data: { favorites: user.favorites },
    });
  } catch (error) {
    next(error);
  }
};
