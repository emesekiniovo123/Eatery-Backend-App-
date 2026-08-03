const mongoose = require('mongoose');
const Food = require('../models/Food');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// =====================================
// Get Menu
// =====================================
exports.getMenu = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    // Limit maximum page size to prevent abuse
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100
    );

    const skip = (page - 1) * limit;

    const filter = {};

    // Search by name
    if (req.query.search?.trim()) {
      filter.name = {
        $regex: req.query.search.trim(),
        $options: 'i',
      };
    }

    // Filter by category
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Filter by availability
    if (req.query.available !== undefined) {
      filter.available = req.query.available === 'true';
    }

    // Backward-compatible price filtering aliases
    const minPrice = req.query.minPrice ?? req.query.priceMin;
    const maxPrice = req.query.maxPrice ?? req.query.priceMax;

    // Price filtering
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice && !Number.isNaN(Number(minPrice))) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice && !Number.isNaN(Number(maxPrice))) {
        filter.price.$lte = Number(maxPrice);
      }

      // Remove empty price filter
      if (Object.keys(filter.price).length === 0) {
        delete filter.price;
      }
    }

    // Sorting
    let sort = { price: 1, ratings: -1 };

    switch (req.query.sort) {
      case 'rating':
        sort = { ratings: -1 };
        break;

      case 'price-desc':
        sort = { price: -1 };
        break;

      case 'price-asc':
        sort = { price: 1 };
        break;

      case 'newest':
        sort = { createdAt: -1 };
        break;
    }

    const [foods, total] = await Promise.all([
      Food.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      Food.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: 'Menu fetched successfully',
      data: {
        foods,
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

// =====================================
// Get Food By ID
// =====================================
exports.getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid food ID',
      });
    }

    const food = await Food.findById(id).lean();

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Food fetched successfully',
      data: { food },
    });
  } catch (error) {
    next(error);
  }
};

// =====================================
// Create Food
// =====================================
exports.createFood = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
    };

    if (req.file) {
      payload.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      payload.image = req.body.image;
    }

    const food = await Food.create(payload);

    res.status(201).json({
      success: true,
      message: 'Food created successfully',
      data: { food },
    });
  } catch (error) {
    next(error);
  }
};

// =====================================
// Update Food
// =====================================
exports.updateFood = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid food ID',
      });
    }

    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found',
      });
    }

    const updatePayload = { ...req.body };

    if (req.file) {
      updatePayload.image = `/uploads/${req.file.filename}`;
    }

    Object.assign(food, updatePayload);

    await food.save();

    res.status(200).json({
      success: true,
      message: 'Food updated successfully',
      data: { food },
    });
  } catch (error) {
    next(error);
  }
};

// =====================================
// Delete Food
// =====================================
exports.deleteFood = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid food ID',
      });
    }

    const food = await Food.findByIdAndDelete(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Food deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
