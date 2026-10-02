const dangerousKey = (key) => key.startsWith('$') || key.includes('.');

const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      value[index] = sanitizeValue(item);
    });
    return value;
  }

  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      if (dangerousKey(key)) {
        delete value[key];
        continue;
      }
      value[key] = sanitizeValue(value[key]);
    }
    return value;
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  return value;
};

/**
 * Strip Mongo operator keys and trim incoming strings.
 */
export const sanitizeRequest = (req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    sanitizeValue(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    sanitizeValue(req.params);
  }
  next();
};
