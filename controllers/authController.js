const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");


// SIGNUP
exports.signup = async (req, res) => {
  try {

    const { username, name, email, password, phone } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({
        message: "All required fields must be filled"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (username,name,email,password,phone,role)
      VALUES (?,?,?,?,?,?)
    `;

    db.query(
      sql,
      [username, name, email, hashedPassword, phone || null, "user"],
      (err, result) => {

        if (err) {
          return res.status(500).json({
            message: "Database error",
            error: err
          });
        }

        res.status(201).json({
          message: "User registered successfully"
        });

      }
    );

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};



// LOGIN
exports.login = (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required"
    });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (!result || result.length === 0) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid password"
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login successful",
        token
      });

    }
  );
};