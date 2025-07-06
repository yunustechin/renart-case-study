import 'dotenv/config';
import logger from '../utils/logger.js';

const GOLD_API_URL = "https://www.goldapi.io/api/XAU/USD";
const API_KEY = process.env.GOLD_API_KEY; 
const CACHE_DURATION_MS = 5 * 60 * 1000; 
const OUNCE_TO_GRAM_CONVERSION_RATE = 31.1035; 

let cachedGoldPrice = {
  priceInUSDPerGram: null,
  timestamp: 0,
};

/**
 * Fetches the current gold price in USD per gram from the GoldAPI.io service.
 * It retrieves the price per ounce and converts it to price per gram.
 * The result is cached in-memory to minimize API requests.
 * @returns {Promise<number|null>} A promise that resolves to the gold price in USD per gram, or null if an error occurs.
 */
export async function getGoldPrice() {
  const now = Date.now();

  if (cachedGoldPrice.priceInUSDPerGram !== null && (now - cachedGoldPrice.timestamp < CACHE_DURATION_MS)) {
    logger.info("Returning gold price (USD/Gram) from CACHE.");
    return cachedGoldPrice.priceInUSDPerGram;
  }

  if (!API_KEY) {
    logger.error("GOLD_API_KEY environment variable not found. Please check your configuration.");
    return null; 
  }

  try {
    logger.info("Cache is stale or empty. Fetching new data from GoldAPI.io...");

    const response = await fetch(GOLD_API_URL, {
      headers: {
        'x-access-token': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`GoldAPI.io service is unreachable. Status: ${response.status} - ${errorBody}`);
    }

    const result = await response.json();

    const pricePerOunce = result.price;
    const pricePerGram = parseFloat((pricePerOunce / OUNCE_TO_GRAM_CONVERSION_RATE).toFixed(2));

    cachedGoldPrice = {
      priceInUSDPerGram: pricePerGram,
      timestamp: now,
    };

    logger.info(`Successfully fetched. New gold price (USD/Gram): $${pricePerGram}`);

    return pricePerGram;

  } catch (error) {
    logger.error("Failed to fetch or process gold price:", error.message);
    return null;
  }
}