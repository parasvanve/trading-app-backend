const walletService = require("../services/walletService");

// Get wallet balance
exports.getWallet = async (req, res) => {
  const userId = req.body.userId; // ya JWT se extract karenge
  const wallet = await walletService.getWallet(userId);
  res.json(wallet);
};

// Deposit request (auto approved)
exports.deposit = async (req, res) => {
  const { userId, amount } = req.body;
  const transaction = await walletService.createDeposit(userId, amount);
  res.json(transaction);
};

// Withdraw request (check balance)
exports.withdraw = async (req, res) => {
  const { userId, amount } = req.body;
  const transaction = await walletService.createWithdraw(userId, amount);
  res.json(transaction);
};

// Transaction history
exports.getTransactions = async (req, res) => {
  const userId = req.body.userId;
  const transactions = await walletService.getTransactions(userId);
  res.json(transactions);
};