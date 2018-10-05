import React from 'react';

// Components

import { Page } from '../../../components';

// ----------------

export default class ArchivePage extends Page {
  // Page (Route) config

  static title = 'Archive';
  static path = '/main/archive';

  // -------- Methods --------

  // Render

  render() {
    return <div>Archive</div>;
  }
}
