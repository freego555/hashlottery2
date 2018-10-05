import * as TYPES from '../actionTypes/users';
import * as URL from '../../constants/endpoints';

// Fetch all users

export const fetchUsers = (payload, data) => ({
  networkType: TYPES.FETCH_ALL_USERS_NETWORK,
  endpoint: query => URL.FETCH_ALL_USERS,
  then: data => {}
});
