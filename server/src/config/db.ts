import mysql from 'mysql2/promise';

export const baseConfig = {
  host: 'localhost',
  user: 'root',
  password: 'newpassword',
  database: 'mailing_app',
};

const pool = mysql.createPool(baseConfig);

export default pool;
