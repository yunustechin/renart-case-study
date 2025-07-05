const fs = require('fs').promises;
const path = require('path');
const productsFilePath = path.join(__dirname, '../products.json');

/**
 * Reads and processes the products from the JSON file.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of products, each with an ID.
 */
const getProducts = async () => {
  const data = await fs.readFile(productsFilePath, 'utf8');
  const products = JSON.parse(data);

  const productsWithId = products.map((product, index) => ({
    id: index,
    ...product
  }));

  return productsWithId;
};

/**
 * Finds a single product by its numeric ID.
 * @param {string|number} productId The ID of the product to find.
 * @returns {Promise<Object|undefined>} A promise that resolves to the product object, or undefined if not found.
 */
const getProductById = async (productId) => {
  const allProducts = await getProducts();
  const numericId = parseInt(productId, 10);

  if (isNaN(numericId)) {
    return undefined;
  }

  return allProducts.find((p) => p.id === numericId);
};

module.exports = {
  getProducts,
  getProductById,
};
