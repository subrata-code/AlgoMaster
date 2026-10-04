import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { AppError, resolveRoleFromEmail } from '../utils/helpers.js';
import { createPasswordResetToken, hashResetToken, signToken } from '../utils/jwt.js';
import { HTTP_STATUS } from '../constants/index.js';
import env from '../config/env.js';
import { sendEmail } from '../utils/email.js';

const client = new OAuth2Client(env.googleClientId);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Register a new user. Role is admin only if email matches ADMIN_EMAIL.
 */
export const signup = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw new AppError('An account with this email already exists', HTTP_STATUS.CONFLICT);
  }

  const role = resolveRoleFromEmail(normalizedEmail);

  const otp = generateOTP();

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    username: normalizedEmail.split('@')[0],
    password,
    role,
    provider: 'local',
    isEmailVerified: false,
    emailVerificationToken: otp,
    emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    onboarding: { completed: false, tourCompleted: false },
  });

  await sendEmail({
    to: user.email,
    subject: 'AlgoMaster - Email Verification',
    text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
    html: `<h2>Welcome to AlgoMaster!</h2><p>Your verification code is: <strong>${otp}</strong></p><p>It will expire in 10 minutes.</p>`,
  });

  // Do not sign token here. User must verify email.
  return { user, requiresVerification: true };
};

export const verifyEmail = async ({ email, otp }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({
    email: normalizedEmail,
    emailVerificationToken: otp,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Invalid or expired verification code', HTTP_STATUS.BAD_REQUEST);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  const token = signToken(user._id.toString());
  return { user, token };
};

export const resendVerificationEmail = async ({ email }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  if (user.isEmailVerified) {
    throw new AppError('Email is already verified', HTTP_STATUS.BAD_REQUEST);
  }

  const otp = generateOTP();
  user.emailVerificationToken = otp;
  user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendEmail({
    to: user.email,
    subject: 'AlgoMaster - Email Verification',
    text: `Your new verification code is: ${otp}. It will expire in 10 minutes.`,
    html: `<h2>Welcome to AlgoMaster!</h2><p>Your new verification code is: <strong>${otp}</strong></p><p>It will expire in 10 minutes.</p>`,
  });

  return { message: 'Verification email resent' };
};

export const googleLogin = async (accessToken) => {
  // Fetch user info from Google using the access token
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  if (!response.ok) {
    throw new AppError('Invalid Google token', HTTP_STATUS.UNAUTHORIZED);
  }

  const payload = await response.json();
  const { email, name, picture } = payload;
  const normalizedEmail = email.toLowerCase().trim();

  let user = await User.findOne({ email: normalizedEmail });
  
  if (!user) {
    const role = resolveRoleFromEmail(normalizedEmail);
    user = await User.create({
      name,
      email: normalizedEmail,
      username: normalizedEmail.split('@')[0],
      role,
      provider: 'google',
      isEmailVerified: true,
      profileImage: picture,
      onboarding: { completed: false, tourCompleted: false },
    });
  } else {
    // If local user logs in with Google, mark verified and optionally update image
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      user.provider = 'google';
      await user.save();
    }
  }

  const token = signToken(user._id.toString());
  return { user, token };
};

/**
 * Authenticate with email + password.
 */
export const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
  }

  if (!user.isEmailVerified) {
    return { user: { email: user.email }, requiresVerification: true };
  }

  const token = signToken(user._id.toString());
  user.password = undefined;

  return { user, token };
};

/**
 * Return the current authenticated user document.
 */
export const getMe = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  return user;
};

/**
 * Issue a password-reset token. Always returns a generic message to avoid email enumeration.
 * Email delivery is not wired in this phase — token is returned in development only.
 */
export const forgotPassword = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  const generic = {
    message: 'If an account exists with that email, a reset link has been sent.',
  };

  if (!user) {
    return generic;
  }

  const { resetToken, hashedToken, expireMs } = createPasswordResetToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = new Date(expireMs);
  await user.save({ validateBeforeSave: false });

  // Email sending will be added later. In development, expose token for testing.
  if (env.nodeEnv === 'development') {
    return {
      ...generic,
      resetToken,
      resetUrl: `${env.clientUrl}/reset-password?token=${resetToken}`,
    };
  }

  return generic;
};

/**
 * Reset password using a valid reset token.
 */
export const resetPassword = async ({ token, password }) => {
  const hashedToken = hashResetToken(token);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire');

  if (!user) {
    throw new AppError('Invalid or expired reset token', HTTP_STATUS.BAD_REQUEST);
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const authToken = signToken(user._id.toString());

  return { user, token: authToken };
};
