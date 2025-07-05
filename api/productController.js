const productService = require('./productService');

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
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

module.exports = {
  getAllProducts,
  getProductById,
};
