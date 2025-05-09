const pool = require("../config/db");
const dateHandler = require("../utils/dateHandler");

exports.getAllTourDates = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tour_dates");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTourDateById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tour_dates WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Not found" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTourDate = async (req, res) => {
  const { tour_id, date, time } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tour_dates (tour_id, date, time) VALUES ($1, $2, $3) RETURNING *",
      [tour_id, date, time]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTourDate = async (req, res) => {
  const { date, time } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tour_dates SET date = $1, time = $2 WHERE id = $3 RETURNING *",
      [date, time, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Not found" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTourDate = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM tour_dates WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted", tourDate: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTourDatesByTourId = async (req, res) => {
  try {
    const tourId = req.params.tourId;
    const result = await pool.query(
      "SELECT id, date, time FROM tour_dates WHERE tour_id = $1",
      [tourId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
