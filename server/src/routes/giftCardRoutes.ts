import { Router } from 'express';
import {
  getGiftCards,
  getGiftCardsByIds,
  updateGiftCards,
} from '../controllers/giftCardController';

const router = Router();

router.get('/gift-cards', getGiftCards);
router.put('/gift-cards', updateGiftCards);
router.get('/gift-cards/ids', getGiftCardsByIds);

export default router;
