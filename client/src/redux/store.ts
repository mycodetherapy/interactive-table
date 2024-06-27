import { createStore, combineReducers } from 'redux';
import mailingsReducer from './mailingsSlice';

const rootReducer = combineReducers({
  mailings: mailingsReducer,
});

export const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
