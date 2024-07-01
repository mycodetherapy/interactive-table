import { createStore, combineReducers, applyMiddleware } from 'redux';
import mailingsReducer from './mailingsSlice';
import giftCardsSliceReducer from './giftCardSlice';
import { thunk } from 'redux-thunk';

const rootReducer = combineReducers({
  mailings: mailingsReducer,
  giftCards: giftCardsSliceReducer,
});

//export const store = createStore(rootReducer);
export const store = createStore(rootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
