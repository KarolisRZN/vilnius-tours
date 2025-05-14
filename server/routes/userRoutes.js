const express = require("express");
const userController = require("../controllers/userController");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth.js");
const bcrypt = require("bcrypt");

const router = express.Router();

// User CRUD
router.post("/users", userController.createUser);

router.get("/users/me", authMiddleware, userController.getMe);
router.put("/users/me", authMiddleware, userController.updateMe);

// Now the generic id route
router.get("/users/:id", userController.getUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, "user"]
    );
    res
      .status(201)
      .json({ message: "Registration successful!", user: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, password FROM users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user info
router.get("/me", authMiddleware, userController.getMe);

// Update current user info
router.put("/me", authMiddleware, userController.updateMe);

// Get current user's wallet
router.get("/me/wallet", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query("SELECT wallet FROM users WHERE id = $1", [userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.json({ wallet: result.rows[0].wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add money to wallet
router.patch("/me/wallet", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }
    const result = await pool.query(
      "UPDATE users SET wallet = wallet + $1 WHERE id = $2 RETURNING wallet",
      [amount, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.json({ wallet: result.rows[0].wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
