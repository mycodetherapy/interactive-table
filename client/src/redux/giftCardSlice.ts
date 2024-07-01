import { AnyAction } from 'redux';
import { GiftCard } from '../types';

interface GiftCardsState {
  giftCards: GiftCard[];
  currentGiftCards: GiftCard[];
  error: string | null;
}

const initialState: GiftCardsState = {
  giftCards: [],
  currentGiftCards: [],
  error: null,
};

const DECREMENT_GIFT_CARD_QUANTITY = 'giftCards/decrementGiftCardQuantity';
const INCREMENT_GIFT_CARD_QUANTITY = 'giftCards/incrementGiftCardQuantity';
const FETCH_GIFT_CARDS_SUCCESS = 'giftCards/fetchGiftCardsSuccess';
const UPDATE_GIFT_CARDS_SUCCESS = 'giftCards/updateGiftCardsSuccess';
const GIFT_CARDS_FAILURE = 'giftCards/giftCardsFailure';
const CURRENT_GIFT_CARDS = 'giftCards/fetchCurrentGiftCards';

export const decrementGiftCardQuantity = (id: number) => ({
  type: DECREMENT_GIFT_CARD_QUANTITY,
  payload: id,
});

export const incrementGiftCardQuantity = (id: number) => ({
  type: INCREMENT_GIFT_CARD_QUANTITY,
  payload: id,
});

export const fetchGiftCardsSuccess = (giftCards: GiftCard[]) => ({
  type: FETCH_GIFT_CARDS_SUCCESS,
  payload: giftCards,
});

export const fetchCurrentGiftCards = (currentGiftCards: GiftCard[]) => ({
  type: FETCH_GIFT_CARDS_SUCCESS,
  payload: currentGiftCards,
});

export const updateGiftCardsSuccess = (giftCards: GiftCard[]) => ({
  type: UPDATE_GIFT_CARDS_SUCCESS,
  payload: giftCards,
});

export const giftCardsFailure = (error: string) => ({
  type: GIFT_CARDS_FAILURE,
  payload: error,
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
    case FETCH_GIFT_CARDS_SUCCESS:
      return {
        ...state,
        giftCards: action.payload,
        error: null,
      };
    case FETCH_GIFT_CARDS_SUCCESS:
      return {
        ...state,
        giftCards: action.payload,
        error: null,
      };

    case CURRENT_GIFT_CARDS:
      return {
        ...state,
        currentGiftCards: action.payload,
        error: null,
      };
    case GIFT_CARDS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default giftCardsSliceReducer;
