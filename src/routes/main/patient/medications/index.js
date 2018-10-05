import React from 'react';

// Components

import { Page } from '../../../../components';

// ----------------

export default class MedicationsTab extends Page {
  // Route config

  static permission = 'permission';
  static title = 'Medications';
  static asTab = { displayName: 'Medications', queryName: 'medications' };

  // Bind methods

  pageContent = this.pageContent.bind(this);

  // -------- Methods --------

  // Content of route

  pageContent() {
    return <React.Fragment>Medications tab</React.Fragment>;
  }

  // Render

  render() {
    return this.securRenderPage(this.pageContent);
  }
}
