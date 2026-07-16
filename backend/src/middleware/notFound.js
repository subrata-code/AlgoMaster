import { AppError } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Catch-all for unmatched routes.
 */
export const notFound = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, HTTP_STATUS.NOT_FOUND));
};
