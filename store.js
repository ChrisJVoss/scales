import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import AuthReducer from './state/Auth/reducers';

export const store = createStore(
  combineReducers({
    auth: AuthReducer
  }),
  applyMiddleware(ReduxThunk)
);
