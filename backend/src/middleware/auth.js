import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';
import { AppError, asyncHandler } from '../utils/helpers.js';
import { AUTH_COOKIE, HTTP_STATUS } from '../constants/index.js';

/**
 * Protect routes — requires a valid JWT (cookie or Authorization Bearer).
 */
export const protect = asyncHandler(async (req, _res, next) => {
  let token;

  if (req.cookies?.[AUTH_COOKIE]) {
    token = req.cookies[AUTH_COOKIE];
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized. Please log in.', HTTP_STATUS.UNAUTHORIZED);
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    throw new AppError('Invalid or expired token. Please log in again.', HTTP_STATUS.UNAUTHORIZED);
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError('User no longer exists.', HTTP_STATUS.UNAUTHORIZED);
  }

  req.user = user;
  next();
});
