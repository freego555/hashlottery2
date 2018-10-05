import React from 'react';
import types from 'prop-types';

// Components

import { QueryLink } from '../../../';

// Styles

import './styles.scss';

// ----------------

// Type of props

BaseTabsHeader.propTypes = {
  activeTabIndex: types.number,
  className: types.string,
  style: types.object,
  tabs: types.array.isRequired,
  name: types.string
};

// Default value for props

BaseTabsHeader.defaultProps = {
  activeTabIndex: 0,
  className: '',
  tabs: []
};

// ----------------

export default function BaseTabsHeader(props) {
  const { className, style, tabs, name, activeTabIndex } = props;

  return (
    <div className={`base-tabs-header ${className}`} style={style}>
      <div className="base-tabs-header__tab-list">
        {tabs.map((tab, index) => (
          <QueryLink
            query={{ [name]: tab.queryName }}
            deleteQuery={tab.deleteQuery}
            key={tab.queryName}
          >
            <div
              className={`base-tabs-header__tab ${
                activeTabIndex === index ? 'base-tabs-header__tab--active' : ''
              }`}
            >
              <p className="base-tabs-header__tab-title base-tabs-header__tab-title--hide">
                {tab.displayName}
              </p>
              <p className="base-tabs-header__tab-title base-tabs-header__tab-title--show">
                {tab.displayName}
              </p>
            </div>
          </QueryLink>
        ))}
      </div>
      <div className="base-tabs-header__chin" />
    </div>
  );
}
