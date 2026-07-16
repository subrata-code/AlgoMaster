import User from '../models/User.js';
import { AppError, resolveRoleFromEmail } from '../utils/helpers.js';
import { createPasswordResetToken, hashResetToken, signToken } from '../utils/jwt.js';
import { HTTP_STATUS } from '../constants/index.js';
import env from '../config/env.js';

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

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role,
    provider: 'local',
  });

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
