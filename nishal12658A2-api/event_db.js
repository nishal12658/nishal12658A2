const mysql = require('mysql2');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin12345',
  database: 'charityevents_db'
});
module.exports = pool.promise();