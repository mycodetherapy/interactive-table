import { AnyAction } from 'redux';
import { Mailing } from '../types';

interface MailingState {
  mailings: Mailing[];
  currentPage: number;
  totalMailings: number;
  error: string | null;
}

const initialState: MailingState = {
  mailings: [],
  currentPage: 1,
  totalMailings: 0,
  error: null,
};

const ADD_MAILING = 'mailing/addMailing';
const REMOVE_MAILING = 'mailing/removeMailing';
const UPDATE_MAILING = 'mailing/updateMailing';
const FETCH_MAILINGS_SUCCESS = 'mailings/fetchMailingsSuccess';
const FETCH_MAILINGS_FAILURE = 'mailings/fetchMailingsFailure';
const SET_CURRENT_PAGE = 'mailing/setCurrentPage';

export const fetchMailingsSuccess = (
  mailings: Mailing[],
  totalMailings: number
) => ({
  type: FETCH_MAILINGS_SUCCESS,
  payload: { mailings, totalMailings },
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
        //loading: false,
        //error: null,
      };
    case FETCH_MAILINGS_FAILURE:
      return {
        ...state,
        //loading: false,
        //error: action.payload,
      };
    case ADD_MAILING:
      return {
        ...state,
        mailings: [action.payload, ...state.mailings],
      };
    case REMOVE_MAILING:
      return {
        ...state,
        mailings: state.mailings.filter(
          (mailing) => mailing.id !== action.payload
        ),
      };
    case UPDATE_MAILING:
      return {
        ...state,
        mailings: state.mailings.map((mailing) =>
          mailing.id === action.payload.id ? action.payload : mailing
        ),
      };
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    default:
      return state;
  }
};

export default mailingsSliceReducer;
