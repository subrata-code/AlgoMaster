import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import env from '../config/env.js';

/**
 * Sign a JWT for the given user id.
 * @param {string} userId
 * @returns {string}
 */
export const signToken = (userId) => {
  return jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

/**
 * Verify a JWT and return the payload.
 * @param {string} token
 * @returns {{ id: string }}
 */
export const verifyToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};

/**
 * Create a password-reset token (hashed for storage, raw for email link).
 */
export const createPasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const expireMs = Date.now() + 60 * 60 * 1000; // 1 hour

  return { resetToken, hashedToken, expireMs };
};

/**
 * Hash a raw reset token the same way it is stored.
 * @param {string} rawToken
 */
export const hashResetToken = (rawToken) => {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};
