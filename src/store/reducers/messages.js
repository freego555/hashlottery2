import createActionType from '../../modules/createActionType';
import * as BASE_TYPES from '../actionTypes/base';
import * as TYPES from '../actionTypes/messages';

// -------- Default state for branch --------

const defaultState = {
  messages: [],
  next: null
};

// -------- Reducer --------

export default function(state, action) {
  if (!state) return defaultState;
  switch (action.type) {
    case createActionType(TYPES.FETCH_TEAM_MESSAGES_NETWORK): {
      const fetchedMessages = action.result.results || [];
      const next = action.result.next;
      return {
        ...state,
        messages: [...state.messages, ...fetchedMessages],
        next
      };
    }

    case createActionType(TYPES.FETCH_PATIENT_MESSAGES_NETWORK): {
      const messages = action.result.results || [];
      const next = action.result.next;
      return { ...state, messages, next };
    }

    case createActionType(TYPES.READ_MESSAGE_NETWORK): {
      const readedMessage = action.result || {};
      const messages = state.messages.map(
        message => (message.id === readedMessage.id ? readedMessage : message)
      );
      return { ...state, messages };
    }

    case createActionType(TYPES.SEARCH_TEAM_MESSAGES_NETWORK): {
      const messages = action.result.results || [];
      const next = action.result.next;
      return { ...state, messages, next };
    }

    case createActionType(TYPES.DELETE_MESSAGE_NETWORK): {
      const deletedMessageId = +action.result.id;
      const messages = state.messages.filter(message => message.id !== deletedMessageId);
      return { ...state, messages };
    }

    case createActionType(TYPES.SEARCH_PATIENT_MESSAGES_NETWORK): {
      const messages = action.result.results || [];
      const next = action.result.next;
      return { ...state, messages, next };
    }

    case TYPES.DELETE_MESSAGES_FROM_LOCAL_STATE: {
      const messages = [];
      return { ...state, messages };
    }

    case BASE_TYPES.DEFAULT_STATE: {
      return defaultState;
    }

    default:
      return state;
  }
}
