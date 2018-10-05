import createActionType from '../../modules/createActionType';
import * as BASE_TYPES from '../actionTypes/base';
import * as TYPES from '../actionTypes';

// -------- Default state for branch --------

const defaultState = {};

// -------- Reducer --------

export default function(state, action) {
  if (!state) return defaultState;

  switch (action.type) {
    case createActionType(TYPES.TYPE_NAME): {
      return { ...state };
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
