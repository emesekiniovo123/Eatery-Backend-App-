//Import the reduired models
const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');

//create the getDashboard function to fetch the admin dashboard data
exports.getDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalOrders, pendingOrders, totalRevenue, reviews, mostOrderedFoods, salesByMonth] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'Pending' }),
      Order.aggregate([{ $group: { _id: null, revenue: { $sum: '$total' } } }]),
      Review.countDocuments(),
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.food', count: { $sum: '$items.quantity' } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'foods', localField: '_id', foreignField: '_id', as: 'food' } },
      ]),
      Order.aggregate([
        { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, sales: { $sum: '$total' } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      message: 'Admin dashboard fetched successfully',
      data: {
        totalUsers,
        totalOrders,
        revenue: totalRevenue[0]?.revenue || 0,
        pendingOrders,
        mostOrderedFoods,
        salesByMonth,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};
