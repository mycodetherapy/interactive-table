import { AnyAction } from 'redux';
import { GiftCard } from '../types';

interface GiftCardsState {
  giftCards: GiftCard[];
}

const initialState: GiftCardsState = {
  giftCards: [
    {
      id: 1,
      name: 'Gift Card 1',
      remainingQuantity: 10,
      expirationDate: '2024-07-10',
      price: 100,
    },
    {
      id: 2,
      name: 'Gift Card 2',
      remainingQuantity: 5,
      expirationDate: '2024-07-15',
      price: 50,
    },
    {
      id: 3,
      name: 'Gift Card 3',
      remainingQuantity: 8,
      expirationDate: '2024-07-20',
      price: 75,
    },
    {
      id: 4,
      name: 'Gift Card 4',
      remainingQuantity: 15,
      expirationDate: '2024-08-01',
      price: 150,
    },
    {
      id: 5,
      name: 'Gift Card 5',
      remainingQuantity: 2,
      expirationDate: '2024-06-30',
      price: 25,
    },
    {
      id: 6,
      name: 'Gift Card 6',
      remainingQuantity: 20,
      expirationDate: '2024-08-10',
      price: 200,
    },
  ],
};

const DECREMENT_GIFT_CARD_QUANTITY = 'giftCards/decrementGiftCardQuantity';
const INCREMENT_GIFT_CARD_QUANTITY = 'giftCards/incrementGiftCardQuantity';

export const decrementGiftCardQuantity = (id: number) => ({
  type: DECREMENT_GIFT_CARD_QUANTITY,
  payload: id,
});

export const incrementGiftCardQuantity = (id: number) => ({
  type: INCREMENT_GIFT_CARD_QUANTITY,
  payload: id,
});

const giftCardsSliceReducer = (
  state = initialState,
  action: AnyAction
): GiftCardsState => {
  switch (action.type) {
    case DECREMENT_GIFT_CARD_QUANTITY:
      return {
        ...state,
        giftCards: state.giftCards.map((giftCard) =>
          giftCard.id === action.payload && giftCard.remainingQuantity > 0
            ? { ...giftCard, remainingQuantity: giftCard.remainingQuantity - 1 }
            : giftCard
        ),
      };
    case INCREMENT_GIFT_CARD_QUANTITY:
      return {
        ...state,
        giftCards: state.giftCards.map((giftCard) =>
          giftCard.id === action.payload
            ? { ...giftCard, remainingQuantity: giftCard.remainingQuantity + 1 }
            : giftCard
        ),
      };
    default:
      return state;
  }
};

export default giftCardsSliceReducer;
