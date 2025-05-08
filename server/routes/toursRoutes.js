const express = require("express");
const router = express.Router();
const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  addTourDate,
  getTourDates,
} = require("../controllers/toursController");
const { authenticateJWT, isAdmin } = require("../middleware/auth");

// Routes
router.get("/", getAllTours);
router.get("/:id", getTourById);
router.post("/", authenticateJWT, isAdmin, createTour);
router.put("/:id", authenticateJWT, isAdmin, updateTour);
router.delete("/:id", authenticateJWT, isAdmin, deleteTour);
router.post("/:tourId/dates", authenticateJWT, isAdmin, addTourDate);
router.get("/:tourId/dates", getTourDates);

module.exports = router;
