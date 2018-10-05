import { localStorageNames } from '../constants';
import fetch from 'isomorphic-fetch';
import ENV from '../constants/environment';

/**
 * Makes network request
 *
 * @param {string} endpoint
 * @param {object} init
 *
 * @return {object}
 **/

export default async function(endpoint, init) {
  const token = localStorage.getItem(localStorageNames.token);

  // Set headers

  const headers = {
    ...(token ? { Authorization: `JWT ${token}` } : {}),
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  // Merging default headers with another params for request

  const _init = {
    ...init,
    headers
  };

  // Request

  const res = await fetch(`${ENV.API}${endpoint}`, _init);

  // if (res.status === 204) return '';

  const data = await res.json();

  if (res.status < 200 || res.status >= 300) {
    let error = new Error('Network error');
    error.des = { status: 'error', code: res.status, object: data };

    throw error;
  }

  return data;
}
