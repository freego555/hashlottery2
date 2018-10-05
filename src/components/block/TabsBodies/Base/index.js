import React from 'react';
import types from 'prop-types';

// Styles

import './styles.scss';

// ----------------

// Type of props

BaseTabsBody.propTypes = {
  className: types.string,
  children: types.node,
  style: types.object
};

// Default value for props

BaseTabsBody.defaultProps = {
  className: ''
};

// ----------------

export default function BaseTabsBody(props) {
  const { className, style, children } = props;

  return (
    <div className={`base-tabs-body ${className}`} style={style}>
      {children}
    </div>
  );
}
