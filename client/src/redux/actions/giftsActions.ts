import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import { AnyAction } from 'redux';
import {
  getGiftCardsApi,
  getGiftCardsByIdsApi,
  updateGiftCardsApi,
} from '../../api/apiGiftCards';
import {
  fetchCurrentGiftCards,
  fetchGiftCardsSuccess,
  giftCardsFailure,
} from '../giftCardSlice';

export const fetchGiftCards =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    try {
      const giftCards = await getGiftCardsApi();
      dispatch(fetchGiftCardsSuccess(giftCards));
    } catch (error) {
      if (error instanceof Error) dispatch(giftCardsFailure(error.message));
    }
  };

export const fetchGiftCardsByIds =
  (ids: number[]): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      const giftCards = await getGiftCardsByIdsApi(ids);
      dispatch(fetchCurrentGiftCards(giftCards));
    } catch (error) {
      if (error instanceof Error) dispatch(giftCardsFailure(error.message));
    }
  };

export const saveGiftCards =
  (
    updates: { id: number; remainingQuantity: number }[]
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      await updateGiftCardsApi(updates);
      dispatch(fetchGiftCards());
    } catch (error) {
      if (error instanceof Error) dispatch(giftCardsFailure(error.message));
    }
  };
