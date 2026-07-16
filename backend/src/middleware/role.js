import { AppError } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Restrict route access to one or more roles.
 * Must run after `protect`.
 * @param {...string} roles
 */
export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new AppError('Not authorized.', HTTP_STATUS.UNAUTHORIZED));
  }

  if (!roles.includes(req.user.role)) {
    return next(
      new AppError('You do not have permission to perform this action.', HTTP_STATUS.FORBIDDEN),
    );
  }

  return next();
};
