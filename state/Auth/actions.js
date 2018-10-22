import {
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  LOGOUT_USER
} from './types';
import { Auth } from '../../config';

export const loginUser = ({ email, password }) => {
  return dispatch => {
    dispatch({ type: LOGIN_USER });
    Auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        loginUserSuccess(dispatch, user);
      })
      .catch(error => {
        loginUserFail(dispatch);
      });
  };
};

const loginUserSuccess = (dispatch, user) => {
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user
  });
};

const loginUserFail = dispatch => {
  dispatch({ type: LOGIN_USER_FAIL });
};

export const logoutUser = () => {
  Auth.signOut();
  return { type: LOGOUT_USER };
};
