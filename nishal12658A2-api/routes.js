const express = require('express');
const router = express.Router();
const db = require('./event_db');

router.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Get all events with optional filtering
router.get('/events', async (req, res) => {
  try {
    const { date, location, category, status } = req.query;
    let query = `SELECT e.*, c.name as category 
                 FROM events e 
                 LEFT JOIN categories c ON e.category_id = c.id 
                 WHERE e.status != 'suspended'`;
    const params = [];

    if (date) {
      query += ' AND DATE(e.date) = ?';
      params.push(date);
    }

    if (location) {
      query += ' AND e.location LIKE ?';
      params.push(`%${location}%`);
    }

    if (category) {
      query += ' AND c.name = ?';
      params.push(category);
    }

    // Add status filtering based on date and time
    if (status) {
      const currentDateTime = new Date();
      const currentDate = currentDateTime.toISOString().split('T')[0];
      const currentTime = currentDateTime.toTimeString().split(' ')[0];
      
      switch (status.toLowerCase()) {
        case 'upcoming':
          query += ' AND (e.date > ? OR (e.date = ? AND e.time > ?))';
          params.push(currentDate, currentDate, currentTime);
          break;
        case 'past':
          query += ' AND (e.date < ? OR (e.date = ? AND e.time < ?))';
          params.push(currentDate, currentDate, currentTime);
          break;
        case 'current':
          query += ' AND e.date = ? AND e.time <= ?';
          params.push(currentDate, currentTime);
          break;
      }
    }

    query += ' ORDER BY e.date ASC, e.time ASC';

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
    const [rows] = await db.query(`SELECT e.*, c.name as category
                                  FROM events e 
                                  LEFT JOIN categories c ON e.category_id = c.id 
                                  WHERE e.id = ? AND e.status != 'suspended'`, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});


// Search events
router.get('/search', async (req, res) => {
  const { location, category, status } = req.query;
  let query = `SELECT e.*, c.name as category
               FROM events e 
               LEFT JOIN categories c ON e.category_id = c.id 
               WHERE e.status != 'suspended'`;
  let params = [];

  if (location) {
    query += ' AND e.location LIKE ?';
    params.push(`%${location}%`);
  }

  if (category) {
    query += ' AND c.name = ?';
    params.push(category);
  }
  if (status) {
    query += ' AND e.status = ?';
    params.push(status);
  }

  const [rows] = await db.query(query, params);
  res.json(rows);
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
