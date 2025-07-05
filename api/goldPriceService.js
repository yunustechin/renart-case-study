const logger = require('../utils/logger');

const BIGPARA_API_URL = "https://api.bigpara.hurriyet.com.tr/doviz/headerlist/altin";
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

let cachedGoldPrice = {
  price: null,
  timestamp: 0,
};

/**
 * Fetches the current selling price of 1 gram of gold from the Bigpara API, using an in-memory cache.
 * @returns {Promise<number|null>} A promise that resolves to the gold price, or null if an error occurs.
 */
async function getGoldPrice() {
  const now = Date.now();

  if (cachedGoldPrice.price !== null && (now - cachedGoldPrice.timestamp < CACHE_DURATION_MS)) {
    logger.info("Returning gold price from CACHE.");
    return cachedGoldPrice.price;
  }

  try {
    logger.info("Cache is stale or empty. Fetching new gold price from Bigpara API...");
    const response = await fetch(BIGPARA_API_URL);

    if (!response.ok) {
      throw new Error(`Bigpara API is unreachable. Status: ${response.status}`);
    }

    const result = await response.json();
    const gramGold = result.data.find(item => item.SEMBOL === "GLDGR");

    if (!gramGold) {
      throw new Error("Gram Gold (GLDGR) data not found in the API response.");
    }

    const newPrice = gramGold.SATIS;

    cachedGoldPrice = {
      price: newPrice,
      timestamp: now,
    };
    logger.info(`Successfully fetched and cached new gold price: ${newPrice}`);

    return newPrice;

  } catch (error) {
    logger.error("Error fetching gold price:", error.message);
    return null;
  }
}

module.exports = { getGoldPrice };