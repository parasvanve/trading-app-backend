const db = require("../config/db");


// Get wallet balance
exports.getWallet = (userId) => {
  return new Promise((resolve, reject) => {

    console.log("Searching wallet for:", userId);

    db.query(
      "SELECT * FROM wallet WHERE user_id = ?",
      [userId],
      (err, result) => {

        console.log("DB Result:", result);

        if (err) return reject(err);

        resolve(result[0]);

      }
    );

  });
};



// Deposit
exports.createDeposit = (userId, amount) => {

  return new Promise((resolve, reject) => {

    db.query(
      "SELECT * FROM wallet WHERE user_id = ?",
      [userId],
      (err, wallet) => {

        if (err) return reject(err);

        // create wallet if not exist
        if (wallet.length === 0) {

          db.query(
            "INSERT INTO wallet (user_id, balance) VALUES (?, ?)",
            [userId, amount],
            (err2) => {

              if (err2) return reject(err2);

              createTransaction();

            }
          );

        } else {

          db.query(
            "UPDATE wallet SET balance = balance + ? WHERE user_id = ?",
            [amount, userId],
            (err3) => {

              if (err3) return reject(err3);

              createTransaction();

            }
          );

        }

        function createTransaction() {

          db.query(
            "INSERT INTO transactions (user_id, type, amount, status) VALUES (?, 'deposit', ?, 'approved')",
            [userId, amount],
            (err4, result4) => {

              if (err4) return reject(err4);

              resolve({
                message: "Deposit successful",
                transactionId: result4.insertId
              });

            }
          );

        }

      }
    );

  });

};



// Withdraw
exports.createWithdraw = (userId, amount) => {

  return new Promise((resolve, reject) => {

    db.query(
      "SELECT balance FROM wallet WHERE user_id = ?",
      [userId],
      (err, result) => {

        if (err) return reject(err);

        if (!result[0]) {
          return reject(new Error("Wallet not found"));
        }

        const currentBalance = parseFloat(result[0].balance);

        if (currentBalance < amount) {
          return reject(new Error("Insufficient balance"));
        }

        db.query(
          "UPDATE wallet SET balance = balance - ? WHERE user_id = ?",
          [amount, userId],
          (err2) => {

            if (err2) return reject(err2);

            // updated balance fetch
            db.query(
              "SELECT balance FROM wallet WHERE user_id = ?",
              [userId],
              (err3, updatedWallet) => {

                if (err3) return reject(err3);

                const remainingBalance = updatedWallet[0].balance;

                db.query(
                  "INSERT INTO transactions (user_id, type, amount, status) VALUES (?, 'withdraw', ?, 'approved')",
                  [userId, amount],
                  (err4, result4) => {

                    if (err4) return reject(err4);

                    resolve({
                      message: "Withdraw successful",
                      withdrawnAmount: amount,
                      remainingBalance: remainingBalance,
                      transactionId: result4.insertId
                    });

                  }
                );

              }
            );

          }
        );

      }
    );

  });

};



// Transactions history
exports.getTransactions = (userId) => {

  return new Promise((resolve, reject) => {

    db.query(
      "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC",
      [userId],
      (err, result) => {

        if (err) return reject(err);

        resolve(result);

      }
    );

  });

};