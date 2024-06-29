import { Request, Response } from 'express';
import pool from '../config/db';
import { Mailing } from '../models/mailing';
import { RowDataPacket } from 'mysql2';

export const getMailings = async (req: Request, res: Response) => {
  const { page = 1 } = req.query;
  const limit = 20;
  const offset = (Number(page) - 1) * limit;

  try {
    const [results] = await pool.query<Mailing & RowDataPacket[]>(
      'SELECT * FROM mailings LIMIT ? OFFSET ?',
      [limit, offset]
    );
    res.json(results);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};

export const addMailing = async (req: Request, res: Response) => {
  const {
    name,
    giftCards,
    date,
    daysToClaim,
    daysToReceive,
    description,
    cardNumbers,
  } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO mailings (name, date, daysToClaim, daysToReceive, description, cardNumbers) VALUES (?, ?, ?, ?, ?, ?)',
      [name, date, daysToClaim, daysToReceive, description, cardNumbers]
    );
    const mailingId = (result as any).insertId;

    for (const giftCard of giftCards) {
      await pool.query(
        'INSERT INTO mailing_gift_cards (mailingId, giftCardId, quantity) VALUES (?, ?, ?)',
        [mailingId, giftCard.id, giftCard.remainingQuantity]
      );
    }

    res.status(201).json({ id: mailingId, ...req.body });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};

export const updateMailing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    giftCards,
    date,
    daysToClaim,
    daysToReceive,
    description,
    cardNumbers,
  } = req.body;

  try {
    await pool.query(
      'UPDATE mailings SET name = ?, date = ?, daysToClaim = ?, daysToReceive = ?, description = ?, cardNumbers = ? WHERE id = ?',
      [name, date, daysToClaim, daysToReceive, description, cardNumbers, id]
    );

    await pool.query('DELETE FROM mailing_gift_cards WHERE mailingId = ?', [
      id,
    ]);
    for (const giftCard of giftCards) {
      await pool.query(
        'INSERT INTO mailing_gift_cards (mailingId, giftCardId, quantity) VALUES (?, ?, ?)',
        [id, giftCard.id, giftCard.remainingQuantity]
      );
    }

    res.json({ message: 'Mailing updated' });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};

export const deleteMailing = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM mailings WHERE id = ?', [id]);
    res.json({ message: 'Mailing deleted' });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};

export const searchMailings = async (req: Request, res: Response) => {
  const { name } = req.query;

  try {
    const [results] = await pool.query<Mailing & RowDataPacket[]>(
      'SELECT * FROM mailings WHERE name LIKE ?',
      [`%${name}%`]
    );
    res.json(results);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};
