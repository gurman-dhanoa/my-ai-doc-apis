const User = require('../models/User');
const { generateToken } = require('../utils/auth');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendPasswordResetEmail, sendPasswordChangedEmail } = require('../utils/email');

// Register user
const register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw new ApiError(409, 'User with this email or username already exists');
  }

  const user = await User.create({
    username,
    email,
    password
  });

  const token = generateToken(user._id);

  const response = new ApiResponse(
    201,
    {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    },
    'User registered successfully'
  );

  res.status(201).json(response);
});

// Login user
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id);

  const response = new ApiResponse(
    200,
    {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    },
    'Login successful'
  );

  res.status(200).json(response);
});

// Get current user profile
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  const response = new ApiResponse(
    200,
    {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    },
    'User profile fetched successfully'
  );

  res.status(200).json(response);
});

// Update username
const updateUsername = asyncHandler(async (req, res, next) => {
  const { username } = req.body;
  const userId = req.user._id;

  // Check if username is already taken
  const existingUser = await User.findOne({ 
    username, 
    _id: { $ne: userId } 
  });

  if (existingUser) {
    throw new ApiError(409, 'Username is already taken');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { username },
    { new: true, runValidators: true }
  );

  const response = new ApiResponse(
    200,
    {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    },
    'Username updated successfully'
  );

  res.status(200).json(response);
});

// Change password
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Send email notification
  await sendPasswordChangedEmail(user);

  const response = new ApiResponse(
    200,
    null,
    'Password changed successfully'
  );

  res.status(200).json(response);
});

// Forgot password
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal whether email exists or not for security
    const response = new ApiResponse(
      200,
      null,
      'If the email exists, a password reset link has been sent'
    );
    return res.status(200).json(response);
  }

  // Generate reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  try {
    // Send email
    await sendPasswordResetEmail(user, resetToken);

    const response = new ApiResponse(
      200,
      null,
      'If the email exists, a password reset link has been sent'
    );

    res.status(200).json(response);
  } catch (error) {
    // Reset token and expiry if email fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, 'Email could not be sent');
  }
});

// Reset password
const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, password } = req.body;

  // Hash token
  const crypto = require('crypto');
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Send email notification
  await sendPasswordChangedEmail(user);

  const response = new ApiResponse(
    200,
    null,
    'Password reset successfully'
  );

  res.status(200).json(response);
});

module.exports = {
  register,
  login,
  getMe,
  updateUsername,
  changePassword,
  forgotPassword,
  resetPassword
};