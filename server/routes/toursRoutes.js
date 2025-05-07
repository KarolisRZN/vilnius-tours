const express = require("express");
const router = express.Router();
const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} = require("../controllers/toursController");
const { authenticateJWT, isAdmin } = require("../middleware/auth");

// Routes
router.get("/", getAllTours);
router.get("/:id", getTourById);
router.post("/", authenticateJWT, isAdmin, createTour);
router.put("/:id", authenticateJWT, isAdmin, updateTour);
router.delete("/:id", authenticateJWT, isAdmin, deleteTour);

module.exports = router;
