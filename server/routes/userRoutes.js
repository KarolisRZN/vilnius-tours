const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

const setRoutes = (app) => {
  router.post("/users", userController.createUser);
  router.get("/users/:id", userController.getUser);
  router.get("/users", userController.getAllUsers);
  router.put("/users/:id", userController.updateUser);
  router.delete("/users/:id", userController.deleteUser);

  app.use("/api", router);
};

module.exports = setRoutes;
