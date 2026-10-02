import mongoose from 'mongoose';
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

const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);

const formatPagination = (page, pageSize, total) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

const toId = (doc) => {
  if (!doc) return doc;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  obj.id = obj._id ? String(obj._id) : obj.id;
  delete obj.__v;
  return obj;
};

export {
  AppError,
  asyncHandler,
  sendSuccess,
  resolveRoleFromEmail,
  slugify,
  isValidObjectId,
  formatPagination,
  toId,
};
