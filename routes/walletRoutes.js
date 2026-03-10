const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");


router.get("/getWallet", walletController.getWallet);
router.post("/deposit", walletController.deposit);
router.post("/withdraw", walletController.withdraw);
router.get("/transactions", walletController.getTransactions);

module.exports = router;