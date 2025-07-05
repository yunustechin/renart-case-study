import * as productService from './productService.js';

/**
 * Express controller to handle the request for getting all products.
 * It now supports filtering by price range and popularity score.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const { minPrice, maxPrice, popularityScore } = req.query;
    const filters = {
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      popularityScore: popularityScore ? parseFloat(popularityScore) : undefined,
    };
    const products = await productService.getProducts(filters);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

/**
 * Express controller to handle the request for getting a single product by its ID.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (product) {
      res.status(200).json(product);
    } else {
      const error = new Error('Product not found with this ID.');
      error.statusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

