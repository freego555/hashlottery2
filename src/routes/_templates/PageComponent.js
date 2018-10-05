import React from 'react';

// Constants

import {} from '../../constants';

// Components

import { Page } from '../../components';

// Modules

import {} from '../../modules';

// ----------------

export default class NamePage extends Page {
  // Page (Route) config

  static queryForAccess = [];
  static permission = 'permission';
  static access = 'auth | unauth'; // This prop only for top-level pages
  static title = 'title';
  static asTab = { displayName: 'name', queryName: 'name' };
  static path = 'path';

  // Bind methods

  pageContent = this.pageContent.bind(this);

  // -------- Methods --------

  // Content of page (Route)

  pageContent() {
    return <div />;
  }

  // Render

  render() {
    return this.securRenderPage(this.pageContent);
  }
}
