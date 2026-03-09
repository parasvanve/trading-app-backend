const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");

router.get("/get_balance", walletController.getWallet);            // Get balance
router.post("/deposit", walletController.deposit);      // Deposit money
router.post("/withdraw", walletController.withdraw);    // Withdraw money
router.get("/transactions", walletController.getTransactions); // Transaction history

module.exports = router;
 