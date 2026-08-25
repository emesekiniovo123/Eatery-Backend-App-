const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Activity = require('../models/Activity');

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

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
      salesByMonthRaw,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'Pending' }),
      Order.countDocuments({ orderStatus: 'Delivered' }),
      Order.countDocuments({ orderStatus: 'Cancelled' }),
      Order.aggregate([
        { $match: { orderStatus: 'Delivered' } },
        { $group: { _id: null, revenue: { $sum: '$total' } } },
      ]),
      Review.countDocuments(),
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.food', count: { $sum: '$items.quantity' } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'foods', localField: '_id', foreignField: '_id', as: 'food' } },
      ]),
      Order.aggregate([
        { $match: { orderStatus: 'Delivered' } },
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            revenue: { $sum: '$total' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('customer', 'fullName email')
        .populate('items.food', 'name price')
        .lean(),
    ]);

    const totalRevenue = totalRevenueResult[0]?.revenue || 0;
    const salesByMonth = salesByMonthRaw.map((entry) => ({
      month: `${entry._id.year}-${String(entry._id.month).padStart(2, '0')}`,
      label: `${monthNames[entry._id.month - 1] || 'Month'} ${entry._id.year}`,
      revenue: Number(entry.revenue || 0),
      orders: Number(entry.orders || 0),
    }));

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

exports.getActivities = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.userId) query.user = req.query.userId;
    if (req.query.action) query.action = req.query.action;
    if (req.query.from || req.query.to) {
      query.createdAt = {};
      if (req.query.from) query.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) query.createdAt.$lte = new Date(req.query.to);
    }

    const [activities, total] = await Promise.all([
      Activity.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'fullName email role')
        .lean(),
      Activity.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      message: 'Activity log fetched successfully',
      data: {
        activities,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('fullName email phone address role createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either customer or admin',
      });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (req.user._id.toString() === targetUser._id.toString() && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You cannot demote your own admin account from this route.',
      });
    }

    const adminCount = await User.countDocuments({ role: 'admin' });
    if (targetUser.role === 'admin' && role === 'customer' && adminCount <= 1) {
      return res.status(400).json({
        success: false,
        message: 'At least one admin account is required.',
      });
    }

    const previousRole = targetUser.role;
    targetUser.role = role;
    await targetUser.save();

    await Activity.create({
      user: req.user._id,
      userName: req.user.fullName,
      userEmail: req.user.email,
      action: 'role_changed',
      resourceType: 'User',
      resourceId: targetUser._id.toString(),
      metadata: {
        targetUser: targetUser._id.toString(),
        targetUserEmail: targetUser.email,
        previousRole,
        newRole: role,
      },
    });

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user: {
          _id: targetUser._id,
          fullName: targetUser.fullName,
          email: targetUser.email,
          role: targetUser.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};