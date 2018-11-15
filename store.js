import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import AuthReducer from './state/Auth/reducers';
import SortForms from './state/SortForms/reducers';

export const store = createStore(
  combineReducers({
    auth: AuthReducer,
    sortForms: SortForms
  }),
  applyMiddleware(ReduxThunk)
);
