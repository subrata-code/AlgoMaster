/**
 * @typedef {'admin' | 'user'} UserRole
 */

/**
 * @typedef {Object} AuthTokens
 * @property {string} token
 */

/**
 * @typedef {Object} ApiSuccess
 * @property {true} success
 * @property {string} [message]
 * @property {*} [data]
 */

/**
 * @typedef {Object} ApiErrorBody
 * @property {false} success
 * @property {string} message
 * @property {*} [errors]
 */

export {};
