const cron = require("node-cron");
const db = require("../config/db");
const { getStockPrice } = require("./stockPriceService");
const { updateStockPrice } = require("../models/stockModel");

const updateAllPrices = async () => {

  const [stocks] = await db.promise().execute("SELECT symbol FROM stocks");

  for (const stock of stocks) {

    const price = await getStockPrice(stock.symbol);

    if (price) {
      await updateStockPrice(stock.symbol, price);
      console.log(`${stock.symbol} updated → ${price}`);
    }

  }

};

cron.schedule("*/30 * * * * *", () => {
  console.log("Updating stock prices...");
  updateAllPrices();
});

module.exports = { updateAllPrices };