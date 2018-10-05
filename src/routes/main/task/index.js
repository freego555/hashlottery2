import React from 'react';

// Constants

import { _global } from '../../../constants';

// Components

import { PageTitle, Page } from '../../../components';

// ----------------

export default class TaskPage extends Page {
  // Route config

  static title = _global.lan.pages.taskPage.title;
  static path = '/main/task';

  // Bind methods

  pageContent = this.pageContent.bind(this);

  // -------- Methods --------

  // Content of route

  pageContent() {
    return (
      <React.Fragment>
        <PageTitle>{_global.lan.forms.patientInfoForm.title}</PageTitle>
        <div>Task</div>
      </React.Fragment>
    );
  }

  // Render

  render() {
    return this.securRenderPage(this.pageContent);
  }
}
