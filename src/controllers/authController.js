//Import modules
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_EXPIRY = process.env.JWT_EXPIRES_IN || '30d';

//create  a function to generate a JWT token for the user
const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: JWT_EXPIRY,
  });

  // create a function to sanitize the user object
  //  by removing sensitive information like password
  //  before sending  it to the client
const sanitizeUser = (user) => {
  const data = user.toObject();
  delete data.password;
  return data;
};

exports.signup = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      address: req.body.address,
    });

    const token = createToken(user);
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user: sanitizeUser(user), token },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = createToken(user);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user: sanitizeUser(user), token },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Profile fetched', data: { user: req.user } });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['fullName', 'phone', 'address'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    await req.user.save();
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: sanitizeUser(req.user) },
    });
  } catch (error) {
    next(error);
  }
};



exports.deleteProfile = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};