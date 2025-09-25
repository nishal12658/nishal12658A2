const express = require('express');
const cors = require('cors');
const path = require('path'); // <-- Add this line
const app = express();
const routes = require('./routes');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../nishal12658A2-clientside')));
app.use('/api', routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});