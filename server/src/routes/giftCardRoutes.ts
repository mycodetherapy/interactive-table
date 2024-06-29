import { Router } from 'express';
import {
  getGiftCards,
  updateGiftCards,
} from '../controllers/giftCardController';

const router = Router();

router.get('/gift-cards', getGiftCards);
router.put('/gift-cards', updateGiftCards);

export default router;
