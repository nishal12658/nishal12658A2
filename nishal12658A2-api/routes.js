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

// Get event by ID
router.get('/events/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
});

// Delete event by ID
router.delete('/events/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    res.json({ message: 'Event deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event.', error });
  }
});

// Search events
router.get('/search', async (req, res) => {
  const { location } = req.query;
  let query = 'SELECT * FROM events WHERE 1=1';


  const [rows] = await db.query(query, location);
  res.json(rows);
});
module.exports = router;
