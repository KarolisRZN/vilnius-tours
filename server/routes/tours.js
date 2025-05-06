const express = require('express');
const pool = require('../db');
const router = express.Router();

// gete all tours
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tours');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// get tour by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tours WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Tour not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
