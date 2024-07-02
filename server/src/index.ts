import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mailingRoutes from './routes/mailingRoutes';
import giftCardRoutes from './routes/giftCardRoutes';
import mysql from 'mysql2/promise';
import pool, { baseConfig } from './config/db';

const createDatabaseAndTables = async () => {
  const connectionData = {
    host: baseConfig.host,
    user: baseConfig.user,
    password: baseConfig.password,
  };
  const connection = await mysql.createConnection(connectionData);

  try {
    await connection.query('CREATE DATABASE IF NOT EXISTS mailing_app');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS gift_cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        remainingQuantity INT NOT NULL,
        expirationDate DATE NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS mailings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mailingDate DATE NOT NULL,
        daysToClaim INT NOT NULL,
        daysToReceive INT NOT NULL,
        description TEXT,
        cardNumbers TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS mailing_gifts (
        mailingId INT,
        giftCardId INT,
        quantity INT NOT NULL,
        PRIMARY KEY (mailingId, giftCardId),
        FOREIGN KEY (mailingId) REFERENCES mailings(id) ON DELETE CASCADE,
        FOREIGN KEY (giftCardId) REFERENCES gift_cards(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      INSERT INTO gift_cards (name, remainingQuantity, expirationDate, price) VALUES
      ('Gift Card 1', 10, '2024-08-10', 100.00),
      ('Gift Card 2', 5, '2024-07-15', 50.00),
      ('Gift Card 3', 8, '2024-07-20', 75.00),
      ('Gift Card 4', 15, '2024-08-01', 150.00),
      ('Gift Card 5', 2, '2024-05-30', 25.00),
      ('Gift Card 6', 20, '2024-08-18', 200.00)
    `);

    console.log('Database and tables created successfully');
  } catch (error) {
    console.error('Error creating database and tables:', error);
  } finally {
    await connection.end();
  }
};

const startServer = async () => {
  const app = express();
  const PORT = 3001;

  await createDatabaseAndTables();

  app.use(cors());
  app.use(bodyParser.json());

  app.use('/api/v1', mailingRoutes);
  app.use('/api/v1', giftCardRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
