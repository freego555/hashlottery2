import * as TYPES from '../actionTypes';

// ----------------

// Action creator for the network

export const name = payload => ({
  before: () => {}, // The function is called before the network request
  networkType: TYPES.NAME, // Action type
  endpoint: query => '', // Url for request
  method: '', // HTTP method. 'GET' by default
  then: (data, dispatch) => {} // Called in on successful request
});

// Simple action creator

export const name1 = payload => ({
  payload,
  type: ''
});
