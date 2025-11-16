const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Login user
const fetchAllUsers = asyncHandler(async (req, res, next) => {

  const users = await User.find();

  const response = new ApiResponse(
    200,
    {
      users
    },
    'users fetched successfully'
  );

  res.status(200).json(response);
});

module.exports = {
  fetchAllUsers
};