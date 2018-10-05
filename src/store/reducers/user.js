import createActionType from '../../modules/createActionType';
import * as BASE_TYPES from '../actionTypes/base';
import * as TYPES from '../actionTypes/user';

// -------- Default state for branch --------

const defaultState = {};

// -------- Reducer --------

export default function(state, action) {
  if (!state) return defaultState;

  switch (action.type) {
    case createActionType(TYPES.LOGIN_NETWORK): {
      return { permissions: action.result.permissions, data: action.result.user };
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
