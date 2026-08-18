//Import the required models
const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');

//create the getDashboard function to fetch the admin dashboard data
exports.getDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenueResult,
      reviews,
      mostOrderedFoods,
      salesByMonth,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'Pending' }),
      Order.countDocuments({ orderStatus: 'Delivered' }),
      Order.countDocuments({ orderStatus: 'Cancelled' }),

      //Calculating total revenue
      Order.aggregate([
        { $group: {
           _id: null, 
           revenue: { 
            $sum: '$total'
           }
           }
           }
          ]),

          //Counts total number of customer reviews submitted
      Review.countDocuments(),

          //Calculating the most ordered foods
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.food', count: { $sum: '$items.quantity' } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'foods', localField: '_id', foreignField: '_id', as: 'food' } },
      ]),
//Calculating the sales by month
    
      Order.aggregate([{ $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, sales: { $sum: '$total' } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),


      //Recent oders
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('customer', 'fullName email')
        .populate('items.food', 'name price')
        .lean(),
    ]);

    const totalRevenue = totalRevenueResult[0]?.revenue || 0;

    res.status(200).json({
      success: true,
      message: 'Admin dashboard fetched successfully',
      data: {
        totalUsers,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
        revenue: totalRevenue,
        recentOrders,
        mostOrderedFoods,
        salesByMonth,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Note : The -1 here means descending order