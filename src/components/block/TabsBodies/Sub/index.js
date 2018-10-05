import React from 'react';
import types from 'prop-types';

// Styles

import './styles.scss';

// ----------------

// Type of props

SubTabsBody.propTypes = {
  className: types.string,
  children: types.node,
  style: types.object
};

// Default value for props

SubTabsBody.defaultProps = {
  className: ''
};

// ----------------

export default function SubTabsBody(props) {
  const { className, style, children } = props;

  return (
    <div className={`sub-tabs-body ${className}`} style={style}>
      {children}
    </div>
  );
}
