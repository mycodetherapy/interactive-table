import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import { AnyAction } from 'redux';
import {
  addMailingApi,
  deleteMailingApi,
  getMailings,
  updateMailingApi,
} from '../../api/apiMailings';
import {
  addMailing,
  mailingsFailure,
  fetchMailingsSuccess,
  removeMailing,
  updateMailing,
} from '../slices/mailingsSlice';
import { Mailing } from '../../types';

export const fetchMailings =
  (
    page: number,
    limit: number,
    search: string = ''
  ): ThunkAction<Promise<void>, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    const state = getState();
    const cachedPage = state.mailings.pages[page];
    if (cachedPage && !search.trim()) {
      dispatch(
        fetchMailingsSuccess(cachedPage, state.mailings.totalMailings, page)
      );
    } else {
      try {
        const response = await getMailings(page, limit, search);
        dispatch(
          fetchMailingsSuccess(
            response?.mailings,
            response?.totalMailings,
            page
          )
        );
      } catch (error) {
        if (error instanceof Error) dispatch(mailingsFailure(error.message));
      }
    }
  };

export const createMailing =
  (
    mailing: Mailing
  ): ThunkAction<Promise<void>, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      const response = await addMailingApi(mailing);
      dispatch(addMailing(response));
    } catch (error) {
      throw error;
    }
  };

export const modifyMailing =
  (
    mailing: Mailing
  ): ThunkAction<Promise<void>, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      const response = await updateMailingApi(mailing);
      if (response?.status === 200) {
        dispatch(updateMailing(mailing));
      }
    } catch (error) {
      throw error;
    }
  };

export const removeMailingById =
  (id: number): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      await deleteMailingApi(id);
      dispatch(removeMailing(id));
    } catch (error) {
      if (error instanceof Error) dispatch(mailingsFailure(error.message));
    }
  };
