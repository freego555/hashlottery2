import * as TYPES from '../actionTypes/messages';
import * as URL from '../../constants/endpoints';
import addQuery from '../../modules/addQuery';
import { history, redirectPath } from '../../constants';

// ----------------

// Fetch team messages

export const fetchTeamMessages = payload => ({
  before: () => {
    let query = '';
    if (payload && payload.url) query = payload.url.slice(payload.url.indexOf('?'));
    return query;
  },
  networkType: TYPES.FETCH_TEAM_MESSAGES_NETWORK,
  endpoint: query => `${URL.MESSAGES}${query}`,
  then: data => {}
});

// Fetch patient messages

export const fetchPatientMessages = payload => ({
  before: () => {
    let query = '';
    if (payload && payload.url) query = payload.url.slice(payload.url.indexOf('?'));
    return query;
  },
  networkType: TYPES.FETCH_PATIENT_MESSAGES_NETWORK,
  endpoint: query => URL.PATIENT_MESSAGES,
  then: data => {}
});

// Delete message

export const deleteMessage = payload => ({
  before: () => {},
  networkType: TYPES.DELETE_MESSAGE_NETWORK,
  endpoint: query => `${URL.MESSAGES}${payload.id}/`,
  method: 'DELETE',
  then: (data, dispatch, getState) => {
    addQuery(null, ['messageId'], false);
    const messagesObj = getState().messages;
    if (!messagesObj.messages.length && messagesObj.next) {
      dispatch(fetchTeamMessages({ url: messagesObj.next }));
    }
  }
});

// Delete messages from local state

export const deleteMessagesFromLocalState = payload => ({
  payload,
  type: TYPES.DELETE_MESSAGES_FROM_LOCAL_STATE
});

// Mark message as readed

export const readMessage = payload => ({
  networkType: TYPES.READ_MESSAGE_NETWORK,
  endpoint: query => `${URL.MESSAGES}${payload.id}/`,
  method: 'PATCH',
  then: data => {}
});

// Search messages

export const searchTeamMessages = payload => ({
  before: () => {
    return `?search=${payload.search}`;
  },
  networkType: TYPES.SEARCH_TEAM_MESSAGES_NETWORK,
  endpoint: query => `${URL.MESSAGES}${query}`,
  then: data => {
    addQuery(null, ['messageId'], false);
  }
});

export const searchPatientMessages = payload => ({
  before: () => {
    return `?search=${payload.search}`;
  },
  networkType: TYPES.SEARCH_PATIENT_MESSAGES_NETWORK,
  endpoint: query => `${URL.PATIENT_MESSAGES}${query}`,
  then: data => {
    addQuery(null, ['messageId'], false);
  }
});

//Sending message

export const sendMessage = payload => {
  return {
    networkType: TYPES.SEND_MESSAGE_NETWORK,
    endpoint: query => URL.MESSAGES,
    payload,
    method: 'POST',
    then: data => {
      history.push(redirectPath.afterMessageSent);
    }
  };
};
