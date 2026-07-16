import { validationResult } from 'express-validator';
import { AppError } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Runs after express-validator chains. Forwards field errors to the error handler.
 */
export const validate = (req, _res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return next(new AppError('Validation failed', HTTP_STATUS.BAD_REQUEST, errors));
  }

  return next();
};
