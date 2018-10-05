import * as BASE_TYPES from '../actionTypes/base';
import * as TYPES from '../actionTypes/ui';

// -------- Default state for branch --------

const defaultState = {
  activeUI: {}
};

// -------- Reducer --------

export default function(state, action) {
  if (!state) return defaultState;

  switch (action.type) {
    case TYPES.ADD_ACTIVE_UI: {
      if (state.activeUI[action.payload.name]) {
        return { activeUI: { ...state.activeUI, ...{ [action.payload.name]: false } } };
      }
      return { activeUI: { ...state.activeUI, ...{ [action.payload.name]: true } } };
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
