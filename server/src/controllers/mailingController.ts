import { Request, Response } from 'express';
import pool from '../config/db';
import { Mailing, MailingGift } from '../models/mailing';
import { RowDataPacket } from 'mysql2';

export const getMailings = async (req: Request, res: Response) => {
  const { page = 1 } = req.query;
  const limit = 20;
  const offset = (Number(page) - 1) * limit;

  try {
    const [mailings] = await pool.query<Mailing & RowDataPacket[]>(
      'SELECT * FROM mailings LIMIT ? OFFSET ?',
      [limit, offset]
    );

    for (const mailing of mailings) {
      const [gifts] = await pool.query<MailingGift[] & RowDataPacket[]>(
        'SELECT * FROM mailing_gifts WHERE mailingId = ?',
        [mailing.id]
      );
      mailing.gifts = gifts;
    }

    res.json(mailings);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const addMailing = async (req: Request, res: Response) => {
  const {
    name,
    gifts,
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

    for (const gift of gifts) {
      await pool.query(
        'INSERT INTO mailing_gifts (mailingId, giftCardId, quantity) VALUES (?, ?, ?)',
        [mailingId, gift.giftCardId, gift.quantity]
      );
    }

    res.status(201).json({ id: mailingId, ...req.body });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const updateMailing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    gifts,
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

    const deleteResult = await pool.query(
      'DELETE FROM mailing_gifts WHERE mailingId = ?',
      [id]
    );
    for (const gift of gifts) {
      await pool.query(
        'INSERT INTO mailing_gifts (mailingId, giftCardId, quantity) VALUES (?, ?, ?)',
        [id, gift.giftCardId, gift.quantity]
      );
    }

    res.json({ message: 'Mailing updated' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const deleteMailing = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM mailings WHERE id = ?', [id]);
    await pool.query('DELETE FROM mailing_gifts WHERE mailingId = ?', [id]);
    res.json({ message: 'Mailing deleted' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const searchMailings = async (req: Request, res: Response) => {
  const { name } = req.query;

  try {
    const [mailings] = await pool.query<Mailing & RowDataPacket[]>(
      'SELECT * FROM mailings WHERE name LIKE ?',
      [`%${name}%`]
    );

    for (const mailing of mailings) {
      const [gifts] = await pool.query<MailingGift[] & RowDataPacket[]>(
        'SELECT * FROM mailing_gifts WHERE mailingId = ?',
        [mailing.id]
      );
      mailing.gifts = gifts;
    }

    res.json(mailings);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};
