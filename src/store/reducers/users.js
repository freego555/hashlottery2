import createActionType from '../../modules/createActionType';
import * as BASE_TYPES from '../actionTypes/base';
import * as TYPES from '../actionTypes/users';

// -------- Default state for branch --------

const defaultState = {
    users:[]
};

// -------- Reducer --------

export default function(state, action) {
  if (!state) return defaultState;

  switch (action.type) {
    case createActionType(TYPES.FETCH_ALL_USERS_NETWORK): {
      const users = action.result || [];
      return { ...state, users };
    }

    case TYPES.DEFAULT_BRANCH_STATE: {
      return defaultState;
    }

    case BASE_TYPES.DEFAULT_STATE: {
      return defaultState;
    }

    default:
      return state;
  }
}
