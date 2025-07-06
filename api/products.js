import express from 'express';
import { getAllProducts, getProductById } from './productController.js';
import { validateProductId, handleValidationErrors } from './productValidator.js';

const router = express.Router();

router.get('/', getAllProducts);

router.get(
  '/:id',
  validateProductId,
  handleValidationErrors,
  getProductById
);

export default router;