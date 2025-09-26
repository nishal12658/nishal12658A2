const express = require('express');
const router = express.Router();
const db = require('./event_db');

router.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Get all events with optional filtering
router.get('/events', async (req, res) => {
  try {
    const { date, location, category } = req.query;
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (date) {
      query += ' AND DATE(date) = ?';
      params.push(date);
    }

    if (location) {
      query += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY date ASC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get event by ID
router.get('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
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
  const { location, category, status } = req.query;
  let query = 'SELECT * FROM events WHERE 1=1';
  let params = [];

  if (location) {
    query += ' AND location LIKE ?';
    params.push(`%${location}%`);
  }

  if (category) {
    query += ' AND category_id = ?';
    params.push(category);
  }
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  const [rows] = await db.query(query, params);
  res.json(rows);
});
module.exports = router;
