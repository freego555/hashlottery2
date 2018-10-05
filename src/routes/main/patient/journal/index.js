import React from 'react';

// Components

import { Page } from '../../../../components';

// ----------------

export default class JournalTab extends Page {
  // Route config

  static permission = 'permission';
  static title = 'Journal';
  static asTab = { displayName: 'Journal', queryName: 'journal' };

  // Bind methods

  pageContent = this.pageContent.bind(this);

  // -------- Methods --------

  // Content of route

  pageContent() {
    return <React.Fragment>Journal tab</React.Fragment>;
  }

  // Render

  render() {
    return this.securRenderPage(this.pageContent);
  }
}
