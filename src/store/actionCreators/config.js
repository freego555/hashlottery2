import * as TYPES from '../actionTypes/config';

// ----------------

// Set version of app

export const setAppVersion = payload => ({
  payload,
  type: TYPES.SET_APP_VERSION
});
