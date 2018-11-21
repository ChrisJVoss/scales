import {
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  LOGOUT_USER
} from './types';
import { Auth } from '../../config';

export const loginUser = ({ email, password }) => {
  console.log('login', email, password);
  return dispatch => {
    dispatch({ type: LOGIN_USER });
    Auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        console.log('1', user);
        loginUserSuccess(dispatch, user);
      })
      .catch(error => {
        console.log('2', error);
        loginUserFail(dispatch);
      });
  };
};

const loginUserSuccess = (dispatch, user) => {
  console.log('success', user);
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
