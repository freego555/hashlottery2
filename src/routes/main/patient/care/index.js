import React from 'react';

// Components

import { Page } from '../../../../components';

// ----------------

export default class CareTab extends Page {
  // Route config

  static permission = 'permission';
  static title = 'Care';
  static asTab = { displayName: 'Care', queryName: 'care' };

  // Bind methods

  pageContent = this.pageContent.bind(this);

  // -------- Methods --------

  // Content of route

  pageContent() {
    return <React.Fragment>Care tab</React.Fragment>;
  }

  // Render

  render() {
    return this.securRenderPage(this.pageContent);
  }
}
