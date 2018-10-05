import { maxMobileSize } from '../../constants';
import * as BASE_TYPES from '../actionTypes/base';
import * as TYPES from '../actionTypes/config';

// -------- Default state for branch --------

const defaultState = {
  isMobile: window.innerWidth <= maxMobileSize
};

// -------- Reducer --------

export default function(state, action) {
  if (!state) return defaultState;

  switch (action.type) {
    case TYPES.SET_APP_VERSION: {
      return { ...state, isMobile: action.payload.isMobile };
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
