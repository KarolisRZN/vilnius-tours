const express = require("express");
const router = express.Router();
const toursController = require("../controllers/toursController");
const authMiddleware = require("../middleware/auth.js");

const {
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
  addTourDate,
  getTourDates,
} = toursController;

// Routes
router.get("/", getAllTours);
router.get("/:id", getTourById);
router.post("/", authMiddleware, toursController.createTour);
router.post("/tours", authMiddleware, toursController.createTour);
router.put("/:id", authMiddleware, updateTour);
router.delete("/:id", authMiddleware, deleteTour);
router.post("/:tourId/dates", authMiddleware, addTourDate);
router.get("/:tourId/dates", getTourDates);

module.exports = router;
