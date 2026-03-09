const db = require("../config/db");

const getAllStocks = async () => {
  const [rows] = await db.query("SELECT * FROM stocks");
  return rows;
};

const createStock = async (symbol, company, price, exchange) => {
  const sql = `
  INSERT INTO stocks (symbol, company_name, price, exchange)
  VALUES (?, ?, ?, ?)
  `;

  await db.query(sql, [symbol, company, price, exchange]);
};


const updateStockPrice = async (symbol, price) => {

  const sql = `
    UPDATE stocks
    SET price = ?
    WHERE symbol = ?
  `;

  await db.execute(sql, [price, symbol]);
};
module.exports = { getAllStocks, createStock, updateStockPrice };