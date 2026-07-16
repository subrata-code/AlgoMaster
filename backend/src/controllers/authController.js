import * as authService from '../services/authService.js';
import { asyncHandler, sendSuccess } from '../utils/helpers.js';
import { AUTH_COOKIE, HTTP_STATUS } from '../constants/index.js';
import env from '../config/env.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE, token, cookieOptions);
};

const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  });
};

export const signup = asyncHandler(async (req, res) => {
  const { user, token } = await authService.signup(req.body);
  setAuthCookie(res, token);

  sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Account created successfully',
    data: { user, token },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  setAuthCookie(res, token);

  sendSuccess(res, {
    message: 'Logged in successfully',
    data: { user, token },
  });
});

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);

  sendSuccess(res, {
    message: 'Logged out successfully',
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);

  sendSuccess(res, {
    data: { user },
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);

  sendSuccess(res, {
    message: result.message,
    data: result.resetToken
      ? { resetToken: result.resetToken, resetUrl: result.resetUrl }
      : undefined,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { user, token } = await authService.resetPassword(req.body);
  setAuthCookie(res, token);

  sendSuccess(res, {
    message: 'Password reset successfully',
    data: { user, token },
  });
});
