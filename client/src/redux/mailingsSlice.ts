import { AnyAction } from 'redux';

export interface Mailing {
  id: number;
  name: string;
  date: string;
  giftsSent: number;
  giftCard: GiftCard | null;
  daysToClaim: number;
  daysToReceive: number;
  description: string;
  cardNumbers: string;
}

type GiftCard = {
  expirationDate: string;
  id: number;
  name: string;
  pric: number;
  remainingQuantity: number;
};

interface MailingState {
  mailings: Mailing[];
}

const initialState: MailingState = {
  mailings: [],
};

const ADD_MAILING = 'mailing/addMailing';
const REMOVE_MAILING = 'mailing/removeMailing';
const UPDATE_MAILING = 'mailing/updateMailing';

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

const mailingsSliceReducer = (
  state = initialState,
  action: AnyAction
): MailingState => {
  switch (action.type) {
    case ADD_MAILING:
      return {
        ...state,
        mailings: [...state.mailings, action.payload],
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
    default:
      return state;
  }
};

export default mailingsSliceReducer;
