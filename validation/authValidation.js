const yup = require('yup');

// Register validation schema
const registerSchema = yup.object({
  body: yup.object({
    username: yup
      .string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must not exceed 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    
    email: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email')
      .max(100, 'Email must not exceed 100 characters'),
    
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must not exceed 50 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      )
  })
});

// Login validation schema
const loginSchema = yup.object({
  body: yup.object({
    email: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email'),
    
    password: yup
      .string()
      .required('Password is required')
  })
});

// Update username validation schema
const updateUsernameSchema = yup.object({
  body: yup.object({
    username: yup
      .string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must not exceed 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
  })
});

// Change password validation schema
const changePasswordSchema = yup.object({
  body: yup.object({
    currentPassword: yup
      .string()
      .required('Current password is required'),
    
    newPassword: yup
      .string()
      .required('New password is required')
      .min(6, 'New password must be at least 6 characters')
      .max(50, 'New password must not exceed 50 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'New password must contain at least one lowercase letter, one uppercase letter, and one number'
      )
      .notOneOf([yup.ref('currentPassword')], 'New password must be different from current password')
  })
});

// Forgot password validation schema
const forgotPasswordSchema = yup.object({
  body: yup.object({
    email: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email')
  })
});

// Reset password validation schema
const resetPasswordSchema = yup.object({
  body: yup.object({
    token: yup
      .string()
      .required('Reset token is required'),
    
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must not exceed 50 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      )
  })
});

// Validation middleware
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    }, { abortEarly: false });
    
    return next();
  } catch (error) {
    const errors = error.inner.map(err => ({
      field: err.path.split('.')[1],
      message: err.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
};

module.exports = {
  registerSchema,
  loginSchema,
  updateUsernameSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  validate
};