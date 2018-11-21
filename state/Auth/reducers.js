import {
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  LOGOUT_USER
} from './types';
const INITIAL_STATE = {
  user: null,
  error: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return Object.assign({}, state, { loading: true, error: '' });
    case LOGIN_USER_SUCCESS:
      return Object.assign({}, INITIAL_STATE, { user: action.payload });
    case LOGIN_USER_FAIL:
      return Object.assign({}, INITIAL_STATE, {
        error: 'Invalid Email or Password',
        loading: false
      });
    case LOGOUT_USER:
      return Object.assign({}, { user: null, error: '', loading: false });
    default:
      return state;
  }
};
