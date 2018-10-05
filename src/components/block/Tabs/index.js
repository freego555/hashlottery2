import React from 'react';
import types from 'prop-types';
import query from 'querystringify';
import classNames from 'classnames';

// Constants

import { history } from '../../../constants';

// Style

import './style.scss';

// ----------------

// Type of props

Tabs.propTypes = {
  headerClassName: types.string,
  bodyClassName: types.string,
  className: types.string,
  children: types.array, // Array of tabs (Routes)
  header: types.func, // Component with tab links
  style: types.object,
  name: types.string // Name of tabs group
};

// Default value for props

Tabs.defaultProps = {
  bodyClassName: '',
  className: ''
};

// Modify styles

const modify = props =>
  classNames({
    'tabs--full-height': props.fullHeight
  });

// -------- Utils --------

function getActiveTabIndex(name, children) {
  const queryObject = query.parse(history.location.search);
  let activeTabIndex = 0;

  if (queryObject[name]) {
    activeTabIndex = children.findIndex(tab => tab.asTab.queryName === queryObject[name]);

    if (activeTabIndex === -1) activeTabIndex = 0;
  }

  return activeTabIndex;
}

// -------- Component --------

export default function Tabs(props) {
  const {
    headerClassName,
    bodyClassName,
    className,
    children,
    header: Header,
    body: Body,
    style,
    name
  } = props;

  const activeTabIndex = getActiveTabIndex(name, children);
  const Tab = children[activeTabIndex];

  return (
    <div className={`tabs ${modify(props)} ${className}`} style={style}>
      <Header
        activeTabIndex={activeTabIndex}
        className={headerClassName}
        tabs={children.map(tab => tab.asTab)}
        name={name}
      />
      <Body className={`tabs__body ${bodyClassName}`}>
        <Tab />
      </Body>
    </div>
  );
}
