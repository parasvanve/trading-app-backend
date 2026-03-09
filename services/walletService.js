const db = require("../config/db");

// Get wallet balance
exports.getWallet = (userId) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM wallet WHERE user_id = ?", [userId], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

// Deposit (auto approved)
exports.createDeposit = (userId, amount) => {
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO transactions (user_id, type, amount, status) VALUES (?, 'deposit', ?, 'approved')", [userId, amount], (err, result) => {
      if (err) reject(err);
      else {
        // Update wallet balance
        db.query("UPDATE wallet SET balance = balance + ? WHERE user_id = ?", [amount, userId], (err2) => {
          if (err2) reject(err2);
          else resolve({ transactionId: result.insertId, status: "approved" });
        });
      }
    });
  });
};

// Withdraw (check balance)
exports.createWithdraw = (userId, amount) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT balance FROM wallet WHERE user_id = ?", [userId], (err, result) => {
      if (err) reject(err);
      else if (!result[0] || result[0].balance < amount) reject("Insufficient Balance");
      else {
        // Record transaction
        db.query("INSERT INTO transactions (user_id, type, amount, status) VALUES (?, 'withdraw', ?, 'approved')", [userId, amount], (err2, result2) => {
          if (err2) reject(err2);
          else {
            // Update wallet balance
            db.query("UPDATE wallet SET balance = balance - ? WHERE user_id = ?", [amount, userId], (err3) => {
              if (err3) reject(err3);
              else resolve({ transactionId: result2.insertId, status: "approved" });
            });
          }
        });
      }
    });
  });
};

// Transaction history
exports.getTransactions = (userId) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC", [userId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};