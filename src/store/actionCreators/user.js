import * as TYPES from '../actionTypes/user';
import * as URL from '../../constants/endpoints';

// Constants

import { localStorageNames, history, redirectPath } from '../../constants';

// ----------------

// Login user

export const loginUser = payload => ({
  networkType: TYPES.LOGIN_NETWORK,
  endpoint: query => URL.LOGIN,
  payload,
  method: 'POST',
  then: data => {
    localStorage.setItem(localStorageNames.token, data.token);
    history.push(redirectPath.withToken);
  }
});

// Send email to reset password

export const resetPassword = (payload, callBack) => ({
  networkType: TYPES.RESET_PASSWORD_NETWORK,
  endpoint: query => URL.RESET_PASSWORD,
  payload,
  method: 'POST',
  then: () => {
    if (callBack) callBack();
  }
});

// Create new password

export const newPassword = (payload, callBack) => ({
  networkType: TYPES.CREATE_NEW_PASSWORD_NETWORK,
  endpoint: query => URL.NEW_PASSWORD,
  payload,
  method: 'POST',
  then: () => {
    if (callBack) callBack();
  }
});
