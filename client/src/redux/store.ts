import { createStore, combineReducers } from 'redux';
import mailingsReducer from './mailingsSlice';
import giftCardsSliceReducer from './giftCardSlice';

const rootReducer = combineReducers({
  mailings: mailingsReducer,
  giftCards: giftCardsSliceReducer,
});

export const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
