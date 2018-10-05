import React from 'react';

// Components

import { Page } from '../../../../components';

// ----------------

export default class DiagnosticsTab extends Page {
  // Route config

  static permission = 'permission';
  static title = 'Diagnostics';
  static asTab = { displayName: 'Diagnostics', queryName: 'diagnostics' };

  // Bind methods

  pageContent = this.pageContent.bind(this);

  // -------- Methods --------

  // Content of route

  pageContent() {
    return <React.Fragment>Diagnostics tab</React.Fragment>;
  }

  // Render

  render() {
    return this.securRenderPage(this.pageContent);
  }
}
