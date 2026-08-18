
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// =====================================
// Protect Routes
// =====================================
const protect = async (req, res, next) => {
  try {
    let token = null;

    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }

    // Fallback to cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // No token provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Ensure JWT secret exists
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate payload
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token',
      });
    }

    // Find authenticated user
    const user = await User.findById(decoded.id).select('-password');
//If user account is deleted from Database,
//   Authentication will fail.
    if (!user) 
      {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed',
      });
    }

    // Attach user to request if authentication is successful
    req.user = user;

    // Calling next() tell Express that Authentication is successful
    next();


    //Any error in the try block will be caught here and return a 401 Unauthorized response
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

// ========================================================================================================
// Role Authorization : (...roles) is  a  paramter that allow multiple roles like admin, customer, manager.
// ========================================================================================================
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
//Check if user role is not included  in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorizeRoles,
};


