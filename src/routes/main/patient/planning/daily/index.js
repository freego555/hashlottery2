import React from 'react';

// Components

import { Page, Calendar, DayGrid, DayCell, DayTask, Container } from '../../../../../components';

// Action creators

import { fetchTasks } from '../../../../../store/actionCreators/tasks';

// Action types

import { FETCH_TASKS_NETWORK } from '../../../../../store/actionTypes/tasks';

// ----------------

export default class DailyTab extends Page {
  // Route config

  static title = 'Planning - Daily';
  static asTab = { displayName: 'Daily', queryName: 'day' };

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
        childProps={{ view: 'day', grid: DayGrid, cell: DayCell, task: DayTask }}
      >
        {Calendar}
      </Container>
    );
  }
}
