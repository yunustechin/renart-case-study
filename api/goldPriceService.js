import logger from '../utils/logger.js';

const BIGPARA_API_URL = "https://api.bigpara.hurriyet.com.tr/doviz/headerlist/altin";
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 dakika

let cachedGoldPrice = {
  priceInUSD: null,
  timestamp: 0,
};

/**
 * Fetches the current selling price of 1 gram of gold in USD from the Bigpara API.
 * It does this by fetching the TRY price of gold and the USD/TRY exchange rate, then performing a conversion.
 * Uses an in-memory cache to avoid excessive API calls.
 * @returns {Promise<number|null>} A promise that resolves to the gold price in USD, or null if an error occurs.
 */
export async function getGoldPrice() {
  const now = Date.now();

  if (cachedGoldPrice.priceInUSD !== null && (now - cachedGoldPrice.timestamp < CACHE_DURATION_MS)) {
    logger.info("Returning gold price in USD from CACHE.");
    return cachedGoldPrice.priceInUSD;
  }

  try {
    logger.info("Cache is stale or empty. Fetching new data from Bigpara API...");
    const response = await fetch(BIGPARA_API_URL);

    if (!response.ok) {
      throw new Error(`Bigpara API is unreachable. Status: ${response.status}`);
    }

    const result = await response.json();
    const allData = result.data;

    const gramGoldTry = allData.find(item => item.SEMBOL === "GLDGR");
    if (!gramGoldTry) {
      throw new Error("Gram Gold (GLDGR) data not found in the API response.");
    }
    const goldPriceInTry = gramGoldTry.SATIS;

    const usdTryRate = allData.find(item => item.SEMBOL === "USDTRY");
    if (!usdTryRate) {
      throw new Error("USD/TRY exchange rate (USDTRY) not found in the API response.");
    }
    const exchangeRate = usdTryRate.SATIS;

    if (exchangeRate === 0) {
        throw new Error("USD/TRY exchange rate cannot be zero.");
    }
    const goldPriceInUSD = parseFloat((goldPriceInTry / exchangeRate).toFixed(2));

    cachedGoldPrice = {
      priceInUSD: goldPriceInUSD,
      timestamp: now,
    };
    
    logger.info(`Successfully fetched and calculated new gold price in USD: $${goldPriceInUSD}`);

    return goldPriceInUSD;

  } catch (error) {
    logger.error("Error fetching or calculating gold price:", error.message);
    return null;
  }
}
