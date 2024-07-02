import { createStore, combineReducers, applyMiddleware } from 'redux';
import mailingsReducer from './slices/mailingsSlice';
import giftCardsSliceReducer from './slices/giftCardSlice';
import { thunk } from 'redux-thunk';

const rootReducer = combineReducers({
  mailings: mailingsReducer,
  giftCards: giftCardsSliceReducer,
});

//export const store = createStore(rootReducer);
export const store = createStore(rootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
