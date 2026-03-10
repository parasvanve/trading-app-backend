require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
require("./services/updateStockPriceService");
const stockRoutes = require("./routes/stockRoutes");
const walletRoutes = require("./routes/walletRoutes");
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const verifyToken = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api", stockRoutes);
app.use("/api", walletRoutes);

// Wallet routes (JWT protected)
app.use("/api/wallet", verifyToken, walletRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});