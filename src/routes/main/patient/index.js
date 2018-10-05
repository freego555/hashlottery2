import React from 'react';

// Constants

import { _global } from '../../../constants';

// Components

import { Page, Tabs, BaseTabsHeader, BaseTabsBody } from '../../../components';

// Sub routes

const subRoutes = [
  require('./planning').default,
  require('./care').default,
  require('./medications').default,
  require('./diagnostics').default,
  require('./journal').default
];

// ----------------

export default class PatientPage extends Page {
  // Route config

  static title = _global.lan.pages.patientPage.title;
  static path = '/main/patients/:patientId';

  // Bind methods

  pageContent = this.pageContent.bind(this);

  // -------- Methods --------

  // Content of route

  pageContent() {
    return (
      <Tabs name="tab" header={BaseTabsHeader} body={BaseTabsBody} style={{ height: '100%' }}>
        {subRoutes}
      </Tabs>
    );
  }

  // Render

  render() {
    return this.securRenderPage(this.pageContent);
  }
}
