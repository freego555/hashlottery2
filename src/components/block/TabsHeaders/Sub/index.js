import React from 'react';
import types from 'prop-types';

// Components

import { QueryLink } from '../../../';

// Styles

import './styles.scss';

// ----------------

// Type of props

SubTabsHeader.propTypes = {
  activeTabIndex: types.number,
  className: types.string,
  style: types.object,
  tabs: types.array.isRequired,
  name: types.string
};

// Default value for props

SubTabsHeader.defaultProps = {
  activeTabIndex: 0,
  className: '',
  tabs: []
};

// ----------------

export default function SubTabsHeader(props) {
  const { className, style, tabs, name, activeTabIndex } = props;

  return (
    <div className={`sub-tabs-header ${className}`} style={style}>
      <div className="sub-tabs-header__tab-list">
        {tabs.map((tab, index) => (
          <QueryLink query={{ [name]: tab.queryName }} key={tab.queryName}>
            <div
              className={`sub-tabs-header__tab ${
                activeTabIndex === index ? 'sub-tabs-header__tab--active' : ''
              }`}
            >
              <p className="sub-tabs-header__tab-title sub-tabs-header__tab-title--hide">
                {tab.displayName}
              </p>
              <p className="sub-tabs-header__tab-title sub-tabs-header__tab-title--show">
                {tab.displayName}
              </p>
            </div>
          </QueryLink>
        ))}
      </div>
    </div>
  );
}
