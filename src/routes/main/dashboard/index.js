import React from 'react';

// Components

import { Page } from '../../../components';

// ----------------

export default class DashboardPage extends Page {
  // Page (Route) config

  static title = 'Dashboard';
  static path = '/main/dashboard';

  // -------- Methods --------

  // Render

  render() {
    return <div>Dashboard</div>;
  }
}
