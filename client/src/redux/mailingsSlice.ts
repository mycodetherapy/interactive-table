import { AnyAction } from 'redux';
import { Mailing } from '../types';
import { CLEAR_ERRORS } from './actions/errorActions';

interface MailingState {
  mailings: Mailing[];
  currentPage: number;
  totalMailings: number;
  pages: { [key: number]: Mailing[] };
  error: string | null;
}

const initialState: MailingState = {
  mailings: [],
  currentPage: 1,
  totalMailings: 0,
  error: null,
  pages: {},
};

const ADD_MAILING = 'mailing/addMailing';
const REMOVE_MAILING = 'mailing/removeMailing';
const UPDATE_MAILING = 'mailing/updateMailing';
const FETCH_MAILINGS_SUCCESS = 'mailings/fetchMailingsSuccess';
const FETCH_MAILINGS_FAILURE = 'mailings/fetchMailingsFailure';
const SET_CURRENT_PAGE = 'mailing/setCurrentPage';
const CLEAR_ERROR = 'mailing/clearError';

export const fetchMailingsSuccess = (
  mailings: Mailing[],
  totalMailings: number,
  page: number
) => ({
  type: FETCH_MAILINGS_SUCCESS,
  payload: { mailings, totalMailings, page },
});

export const fetchMailingsFailure = (error: string) => ({
  type: FETCH_MAILINGS_FAILURE,
  payload: error,
});

export const addMailing = (mailing: Mailing) => ({
  type: ADD_MAILING,
  payload: mailing,
});

export const removeMailing = (id: number) => ({
  type: REMOVE_MAILING,
  payload: id,
});

export const updateMailing = (mailing: Mailing) => ({
  type: UPDATE_MAILING,
  payload: mailing,
});

export const setCurrentPage = (page: number) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});

const mailingsSliceReducer = (
  state = initialState,
  action: AnyAction
): MailingState => {
  switch (action.type) {
    case FETCH_MAILINGS_SUCCESS:
      return {
        ...state,
        mailings: action.payload.mailings,
        totalMailings: action.payload.totalMailings,
        pages: {
          ...state.pages,
          [action.payload.page]: action.payload.mailings,
        },
        //loading: false,
        //error: null,
      };
    case FETCH_MAILINGS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_MAILING:
      return {
        ...state,
        mailings: [action.payload, ...state.mailings],
        pages: {},
      };
    case REMOVE_MAILING:
      return {
        ...state,
        mailings: state.mailings.filter(
          (mailing) => mailing.id !== action.payload
        ),
        pages: {},
      };
    case UPDATE_MAILING:
      return {
        ...state,
        mailings: state.mailings.map((mailing) =>
          mailing.id === action.payload.id ? action.payload : mailing
        ),
        pages: {},
      };
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export default mailingsSliceReducer;
