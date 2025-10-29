const { verifyToken, getTokenFromHeader } = require('../utils/auth');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const token = getTokenFromHeader(req);
  
  if (!token) {
    throw new ApiError(401, 'Access denied. No token provided.');
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.userId).select('-password');
  
  if (!user) {
    throw new ApiError(401, 'Token is valid but user no longer exists.');
  }

  req.user = user;
  next();
});

module.exports = { protect };