import { Router } from 'express';
import {
  getMailings,
  addMailing,
  updateMailing,
  deleteMailing,
  searchMailings,
} from '../controllers/mailingController';

const router = Router();

router.get('/mailings', getMailings);
router.get('/mailings/search', searchMailings);
router.post('/mailings', addMailing);
router.put('/mailings/:id', updateMailing);
router.delete('/mailings/:id', deleteMailing);

export default router;
