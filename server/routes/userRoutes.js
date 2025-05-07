const express = require("express");
const userController = require("../controllers/userController");
const pool = require("../config/db");

const router = express.Router();

const setRoutes = (app) => {
  // User CRUD
  router.post("/users", userController.createUser);
  router.get("/users/:id", userController.getUser);
  router.get("/users", userController.getAllUsers);
  router.put("/users/:id", userController.updateUser);
  router.delete("/users/:id", userController.deleteUser);

  // Register
  router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
        [name, email, password, "user"]
      );
      res
        .status(201)
        .json({ message: "Registration successful!", user: result.rows[0] });
    } catch (error) {
      if (error.code === "23505") {
        // unique_violation
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
        "SELECT id, name, email, role FROM users WHERE email = $1 AND password = $2",
        [email, password]
      );
      if (result.rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res
        .status(200)
        .json({ message: "Login successful!", user: result.rows[0] });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.use("/api", router);
};

module.exports = setRoutes;
