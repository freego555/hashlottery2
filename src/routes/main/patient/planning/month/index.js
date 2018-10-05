import React from 'react';

// Components

import {
  Container,
  MonthGrid,
  MonthCell,
  MonthTask,
  Calendar,
  Page
} from '../../../../../components';

// Action creators

import { fetchTasks } from '../../../../../store/actionCreators/tasks';

// Action types

import { FETCH_TASKS_NETWORK } from '../../../../../store/actionTypes/tasks';

// ----------------

export default class MonthTab extends Page {
  // Route config

  static title = 'Planning - Month';
  static asTab = { displayName: 'Month', queryName: 'month' };

  // -------- Methods --------

  // Render

  render() {
    return (
      <Container
        mapState={state => ({
          tasks: state.tasks.list,
          networkProcess: state.network[FETCH_TASKS_NETWORK]
        })}
        mapDispatch={{ fetchTasks }}
        childProps={{ view: 'month', grid: MonthGrid, cell: MonthCell, task: MonthTask }}
      >
        {Calendar}
      </Container>
    );
  }
}
