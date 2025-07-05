import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getGoldPrice } from './goldPriceService.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
 * Applies filters to a list of products.
 * @param {Array<object>} products - The array of products to filter.
 * @param {object} filters - An object containing the filter criteria.
 * @param {number} [filters.minPrice] - The minimum price for the price range filter.
 * @param {number} [filters.maxPrice] - The maximum price for the price range filter.
 * @param {number} [filters.popularityScore] - The popularity score to filter by.
 * @returns {Array<object>} The filtered array of products.
 */
const applyFilters = (products, filters) => {
  let filteredProducts = products;

  if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
    filteredProducts = filteredProducts.filter(p => p.dynamicPrice >= filters.minPrice);
  }

  if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
    filteredProducts = filteredProducts.filter(p => p.dynamicPrice <= filters.maxPrice);
  }

  if (filters.popularityScore !== undefined && !isNaN(filters.popularityScore)) {
    filteredProducts = filteredProducts.filter(p => p.popularityScore === filters.popularityScore);
  }

  return filteredProducts;
};


/**
 * Reads all products and enriches them with a dynamic price based on the current gold price.
 * It can also filter the products based on the provided criteria.
 * @param {object} filters - An object containing filter criteria (minPrice, maxPrice, popularityScore).
 * @returns {Promise<Array<object>>} A promise that resolves to an array of products, each enriched with an 'id' and 'dynamicPrice'.
 * @throws {Error} Throws an error with statusCode 503 if the external gold price API is unreachable.
 */
export const getProducts = async (filters = {}) => {
  const goldPrice = await getGoldPrice();
  if (goldPrice === null) {
    const error = new Error('The service is temporarily unavailable because the external gold price API could not be reached.');
    error.statusCode = 503;
    throw error;
  }

  const data = await fs.readFile(productsFilePath, 'utf8');
  const products = JSON.parse(data);

  const enrichedProducts = products.map((product, index) => ({
    id: index,
    ...product,
    dynamicPrice: calculateDynamicPrice(product, goldPrice),
  }));

  return applyFilters(enrichedProducts, filters);
};

/**
 * Finds a single product by its ID and enriches it with a dynamic price.
 * @param {string|number} productId - The ID (index) of the product to find.
 * @returns {Promise<object|undefined>} A promise that resolves to the found product object, or undefined if not found.
 * @throws {Error} Throws an error with statusCode 503 if the external gold price API is unreachable.
 */
export const getProductById = async (productId) => {
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
