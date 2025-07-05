const express = require('express');
const { getAllProducts, getProductById } = require('./productController');
const { validateProductId, handleValidationErrors } = require('./productValidator');
const router = express.Router();

router.get('/', getAllProducts);
router.get(
  '/:id',
  validateProductId,     
  handleValidationErrors, 
  getProductById          
);

module.exports = router;