const express = require("express");
const router = express.Router();

const authRouter = require("./authRoutes");
const stockRouter = require("./stockRoutes");
const walletRouter = require("./walletRoutes");

router.use("/auth", authRouter);
router.use("/stocks", stockRouter);
router.use("/wallet", walletRouter);

module.exports = router;    