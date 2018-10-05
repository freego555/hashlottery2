import createActionType from '../../modules/createActionType';
import * as BASE_TYPES from '../actionTypes/base';
import * as TYPES from '../actionTypes/tasks';

// -------- Default state for branch --------

const defaultState = {
  list: []
};

// -------- Reducer --------

export default function(state, action) {
  if (!state) return defaultState;

  switch (action.type) {
    case createActionType(TYPES.FETCH_TASKS_NETWORK): {
      return { ...state, list: action.result };
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
