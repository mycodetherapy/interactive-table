import { Request, Response } from 'express';
import pool from '../config/db';
import { GiftCard } from '../models/giftCard';
import { RowDataPacket } from 'mysql2';

export const getGiftCards = async (req: Request, res: Response) => {
  try {
    const [results] = await pool.query<GiftCard & RowDataPacket[]>(
      'SELECT * FROM gift_cards'
    );
    res.json(results);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};

export const getGiftCardsByIds = async (req: Request, res: Response) => {
  const { ids } = req.query;

  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ message: 'Invalid or missing IDs' });
  }

  try {
    const placeholders = ids.map(() => '?').join(',');
    const query = `SELECT * FROM gift_cards WHERE id IN (${placeholders})`;
    const [results] = await pool.query<GiftCard & RowDataPacket[]>(query, ids);

    res.json(results);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const updateGiftCards = async (req: Request, res: Response) => {
  const updates: { id: number; remainingQuantity: number }[] = req.body;

  try {
    for (const { id, remainingQuantity } of updates) {
      await pool.query(
        'UPDATE gift_cards SET remainingQuantity = ? WHERE id = ?',
        [remainingQuantity, id]
      );
    }
    res.json({ message: 'Gift cards updated' });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};
