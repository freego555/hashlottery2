import React from 'react';

// Components

import { Page, Container, Calendar, WeekGrid, WeekCell, WeekTask } from '../../../../../components';

// Action creators

import { fetchTasks } from '../../../../../store/actionCreators/tasks';

// Action types

import { FETCH_TASKS_NETWORK } from '../../../../../store/actionTypes/tasks';

// ----------------

export default class WeekTab extends Page {
  // Route config

  static title = 'Planning - Week';
  static asTab = { displayName: 'Week', queryName: 'week' };

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
        childProps={{ view: 'week', grid: WeekGrid, cell: WeekCell, task: WeekTask }}
      >
        {Calendar}
      </Container>
    );
  }
}
