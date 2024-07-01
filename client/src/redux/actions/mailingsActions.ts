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
  fetchMailingsFailure,
  fetchMailingsSuccess,
  removeMailing,
  updateMailing,
} from '../mailingsSlice';
import { Mailing } from '../../types';

export const fetchMailings =
  (
    page: number,
    limit: number,
    search?: string
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      const response = await getMailings(page, limit, search);
      dispatch(
        fetchMailingsSuccess(response?.mailings, response?.totalMailings)
      );
    } catch (error) {
      if (error instanceof Error) {
        dispatch(fetchMailingsFailure(error.message));
      }
    }
  };

export const createMailing =
  (mailing: Mailing): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      const response = await addMailingApi(mailing);
      dispatch(addMailing(response));
    } catch (error) {
      if (error instanceof Error) dispatch(fetchMailingsFailure(error.message));
    }
  };

export const modifyMailing =
  (mailing: Mailing): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      const response = await updateMailingApi(mailing);
      if (response?.status === 200) {
        dispatch(updateMailing(mailing));
      }
    } catch (error) {
      if (error instanceof Error) dispatch(fetchMailingsFailure(error.message));
    }
  };

export const removeMailingById =
  (id: number): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      await deleteMailingApi(id);
      dispatch(removeMailing(id));
    } catch (error) {
      if (error instanceof Error) dispatch(fetchMailingsFailure(error.message));
    }
  };
