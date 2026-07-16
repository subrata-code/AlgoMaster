import env from '../config/env.js';
import { HTTP_STATUS, ROLES } from '../constants/index.js';

class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} [statusCode=500]
   * @param {*} [errors]
   */
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Wrap async route handlers to forward errors to the central error middleware.
 * @param {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => Promise<*>} fn
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Standard success response helper.
 */
const sendSuccess = (res, { statusCode = HTTP_STATUS.OK, message, data } = {}) => {
  const body = { success: true };
  if (message) body.message = message;
  if (data !== undefined) body.data = data;
  return res.status(statusCode).json(body);
};

/**
 * Resolve user role from email vs ADMIN_EMAIL.
 * @param {string} email
 * @returns {'admin' | 'user'}
 */
const resolveRoleFromEmail = (email) => {
  const normalized = (email || '').toLowerCase().trim();
  if (env.adminEmail && normalized === env.adminEmail) {
    return ROLES.ADMIN;
  }
  return ROLES.USER;
};

export { AppError, asyncHandler, sendSuccess, resolveRoleFromEmail };
