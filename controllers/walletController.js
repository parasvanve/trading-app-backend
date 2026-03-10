const walletService = require("../services/walletService");

// Get wallet balance
exports.getWallet = async (req, res) => {
  try {

    const userId = req.user.id;

    const wallet = await walletService.getWallet(userId);

    return res.status(200).json({
      success: true,
      wallet: wallet
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }
};


// Deposit
exports.deposit = async (req, res) => {
  try {

    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const result = await walletService.createDeposit(userId, amount);

    res.json(result);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};


// Withdraw
exports.withdraw = async (req, res) => {
  try {

    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const result = await walletService.createWithdraw(userId, amount);

    res.json(result);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};


// Transaction history
exports.getTransactions = async (req, res) => {
  try {

    const userId = req.user.id;

    const transactions = await walletService.getTransactions(userId);

    res.json(transactions);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};