import * as TYPES from '../actionTypes/tasks';
import * as URL from '../../constants/endpoints';

// ----------------

// Get tasks on 3 month

export const fetchTasks = payload => ({
  networkType: TYPES.FETCH_TASKS_NETWORK,
  endpoint: query => `${URL.FETCH_TASKS}?date=${payload.date}&file=537167`
});
