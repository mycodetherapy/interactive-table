import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'newpassword',
  database: 'mailing_app',
});

export default pool;
