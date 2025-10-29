const express = require('express');
const { 
  register, 
  login, 
  getMe, 
  updateUsername, 
  changePassword, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { 
  registerSchema, 
  loginSchema, 
  updateUsernameSchema, 
  changePasswordSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema, 
  validate 
} = require('../validation/authValidation');

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.patch('/update-username', protect, validate(updateUsernameSchema), updateUsername);
router.patch('/change-password', protect, validate(changePasswordSchema), changePassword);

module.exports = router;