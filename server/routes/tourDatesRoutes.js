const express = require("express");
const tourDatesController = require("../controllers/tourDatesController");

const router = express.Router();

// CRUD for tour dates
router.get("/", tourDatesController.getAllTourDates);
router.get("/:id", tourDatesController.getTourDateById);
router.post("/", tourDatesController.createTourDate);
router.put("/:id", tourDatesController.updateTourDate);
router.delete("/:id", tourDatesController.deleteTourDate);

// Get tour dates by tour ID
router.get("/tours/:tourId/dates", tourDatesController.getTourDatesByTourId);

module.exports = router;
