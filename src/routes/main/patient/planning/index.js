import React from 'react';
import moment from 'moment';

// Components

import {
  WeekMobileGrid,
  WeekMobileCell,
  SubTabsHeader,
  SubTabsBody,
  Container,
  Calendar,
  DayTask,
  Page,
  Tabs
} from '../../../../components';

// Action creators

import { fetchTasks } from '../../../../store/actionCreators/tasks';

// Action types

import { FETCH_TASKS_NETWORK } from '../../../../store/actionTypes/tasks';

// Sub routes

const subRoutes = [
  require('./daily').default,
  require('./week').default,
  require('./month').default
];

// ----------------

export default class PlanningTab extends Page {
  // Route config

  static permission = 'permission';
  static asTab = { displayName: 'Planning', queryName: 'planning' };

  // Data

  mount = [{ ac: fetchTasks, payload: { date: moment().format('YYYY-MM-DD') } }];

  // Bind methods

  pageContent = this.pageContent.bind(this);

  // -------- Methods --------

  // Sets content based on app version

  versionContent({ isMobile }) {
    return isMobile ? (
      <Container
        mapState={state => ({
          tasks: state.tasks.list,
          networkProcess: state.network[FETCH_TASKS_NETWORK]
        })}
        mapDispatch={{ fetchTasks }}
        childProps={{
          view: 'week',
          grid: WeekMobileGrid,
          cell: WeekMobileCell,
          task: DayTask
        }}
      >
        {Calendar}
      </Container>
    ) : (
      <Tabs header={SubTabsHeader} body={SubTabsBody} name="planning" fullHeight>
        {subRoutes}
      </Tabs>
    );
  }

  // Content of route

  pageContent() {
    return (
      <Container mapState={state => ({ isMobile: state.config.isMobile })} withRouter>
        {this.versionContent}
      </Container>
    );
  }

  // Render

  render() {
    return this.securRenderPage(this.pageContent);
  }
}
