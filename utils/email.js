const ApiError = require('./ApiError');

// In a real application, you would integrate with services like:
// Nodemailer, SendGrid, AWS SES, etc.
const sendEmail = async (options) => {
  try {
    const { email, subject, message } = options;
    
    // Simulate email sending - replace with actual email service
    console.log('=== EMAIL SENDING SIMULATION ===');
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('================================');
    
    // In production, you would use:
    // await transporter.sendMail({ to: email, subject, html: message });
    
    return true;
  } catch (error) {
    throw new ApiError(500, 'Email could not be sent');
  }
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const message = `
    <h1>Password Reset Request</h1>
    <p>Hello ${user.username},</p>
    <p>You requested to reset your password. Click the link below to reset your password:</p>
    <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    <p>This link will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;
  
  await sendEmail({
    email: user.email,
    subject: 'Password Reset Request',
    message
  });
};

const sendPasswordChangedEmail = async (user) => {
  const message = `
    <h1>Password Changed Successfully</h1>
    <p>Hello ${user.username},</p>
    <p>Your password has been changed successfully.</p>
    <p>If you didn't make this change, please contact support immediately.</p>
  `;
  
  await sendEmail({
    email: user.email,
    subject: 'Password Changed Successfully',
    message
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail
};