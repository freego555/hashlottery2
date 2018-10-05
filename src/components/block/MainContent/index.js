import React from 'react';
import types from 'prop-types';

// Styles

import './styles.scss';

// ----------------

// Type of props

MainContent.propTypes = {
  className: types.string,
  children: types.node,
  style: types.object
};

// Default value for props

MainContent.defaultProps = {
  className: ''
};

// ----------------

export default function MainContent(props) {
  const { className, style, children } = props;

  return (
    <div className={`main-content ${className}`} style={style}>
      <div className="main-content__inner">{children}</div>
    </div>
  );
}
