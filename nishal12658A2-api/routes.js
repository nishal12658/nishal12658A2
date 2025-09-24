const express = require('express');
const router = express.Router();

// Sample route - you can modify this based on your assignment requirements
router.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Add more routes here as needed for your assignment
// Example:
// router.get('/events', (req, res) => {
//   res.json({ events: [] });
// });

module.exports = router;
