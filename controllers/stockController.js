const stockModel = require("../models/stockModel");

const getStocks = async (req, res) => {
  try {
    const stocks = await stockModel.getAllStocks();

    res.json({
      success: true,
      data: stocks
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStocks };