const fs = require('fs').promises;
const path = require('path');
const { getGoldPrice } = require('./goldPriceService');
const logger = require('../utils/logger');

const productsFilePath = path.join(__dirname, '../products.json');

/**
 * Calculates the dynamic price for a given product based on the current gold price.
 * This is an internal helper function.
 * @param {object} product - The product object, must contain popularityScore and weight.
 * @param {number} goldPrice - The current price of gold.
 * @returns {number} The calculated dynamic price, rounded to 2 decimal places.
 */
const calculateDynamicPrice = (product, goldPrice) => {
  const price = (product.popularityScore + 1) * product.weight * goldPrice;
  return parseFloat(price.toFixed(2));
};

/**
 * Reads all products and enriches them with a dynamic price based on the current gold price.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of products, each enriched with an 'id' and 'dynamicPrice'.
 * @throws {Error} Throws an error with statusCode 503 if the external gold price API is unreachable.
 */
const getProducts = async () => {
  const goldPrice = await getGoldPrice();
  if (goldPrice === null) {
    const error = new Error('The service is temporarily unavailable because the external gold price API could not be reached.');
    error.statusCode = 503;
    throw error;
  }

  const data = await fs.readFile(productsFilePath, 'utf8');
  const products = JSON.parse(data);

  return products.map((product, index) => ({
    id: index,
    ...product,
    dynamicPrice: calculateDynamicPrice(product, goldPrice),
  }));
};

/**
 * Finds a single product by its ID and enriches it with a dynamic price.
 * @param {string|number} productId - The ID (index) of the product to find.
 * @returns {Promise<object|undefined>} A promise that resolves to the found product object, or undefined if not found.
 * @throws {Error} Throws an error with statusCode 503 if the external gold price API is unreachable.
 */
const getProductById = async (productId) => {
  const goldPrice = await getGoldPrice();
  if (goldPrice === null) {
    const error = new Error('The service is temporarily unavailable because the external gold price API could not be reached.');
    error.statusCode = 503;
    throw error;
  }

  const numericId = parseInt(productId, 10);
  if (isNaN(numericId)) {
    return undefined;
  }

  const data = await fs.readFile(productsFilePath, 'utf8');
  const products = JSON.parse(data);

  const product = products.find((p, index) => index === numericId);

  if (product) {
    return {
      id: numericId,
      ...product,
      dynamicPrice: calculateDynamicPrice(product, goldPrice),
    };
  }

  return undefined;
};

module.exports = {
  getProducts,
  getProductById,
};