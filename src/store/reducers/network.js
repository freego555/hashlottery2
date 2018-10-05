import * as BASE_TYPES from '../actionTypes/base';

// -------- Default state for branch --------

const defaultState = {};

// -------- Reducer --------

export default function(state, action) {
  if (!state) return defaultState;

  switch (true) {
    case /NETWORK$/.test(action.type): {
      return { ...state, [action.type]: { status: 'loading' } };
    }

    case /SUCCESS$/.test(action.type): {
      const newState = {};
      const keys = Object.keys(state);

      keys.forEach(processKey => {
        if (processKey !== action.type.slice(0, action.type.lastIndexOf('_SUCCESS'))) {
          newState[processKey] = state[processKey];
        }
      });

      return newState;
    }

    case /ERROR$/.test(action.type): {
      const processKey = action.type.slice(0, action.type.lastIndexOf('_ERROR'));
      return { ...state, [processKey]: { ...action.errorInfo.des, key: processKey } };
    }

    case action.type === BASE_TYPES.DEFAULT_STATE ||
      action.type === BASE_TYPES.DEFAULT_NETWORK_BRANCH_STATE: {
      return defaultState;
    }

    default:
      return state;
  }
}
