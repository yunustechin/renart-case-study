import { param, validationResult } from 'express-validator';
import logger from '../utils/logger.js';

/**
 * Validation rules for the product ID URL parameter.
 * Checks if the 'id' is a non-negative integer.
 */
export const validateProductId = [
  param('id')
    .isInt({ min: 0 })
    .withMessage('Product ID must be a non-negative integer.'),
];

/**
 * Middleware to handle the result of any validation checks.
 * If there are validation errors, it sends a 400 response. Otherwise, it proceeds.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      logger.warn('Validation error occurred.', {
      errors: errors.array(),
      path: req.originalUrl,
      ip: req.ip,
    });
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};