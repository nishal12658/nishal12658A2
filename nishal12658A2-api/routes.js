const express = require('express');
const router = express.Router();
const db = require('./event_db');

router.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Get all events
router.get('/events', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM events');
  res.json(rows);
});


module.exports = router;
