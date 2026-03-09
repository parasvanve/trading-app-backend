const db = require("../config/db");
const { getStockPrice } = require("./stockPriceService");
const { updateStockPrice } = require("../models/stockModel");

exports.updateAllPrices = async () => {

  const [stocks] = await db.promise().execute("SELECT symbol FROM stocks");

  for (const stock of stocks) {

    const price = await getStockPrice(stock.symbol);

    if (price) {
      await updateStockPrice(stock.symbol, price);
      console.log(`${stock.symbol} updated → ${price}`);
    }

  }

};