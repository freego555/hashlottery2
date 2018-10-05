import React from 'react';
import types from 'prop-types';

// Styles

import './styles.scss';

// ----------------

// Type of props

BaseStepsBody.propTypes = {
  className: types.string,
  children: types.node,
  style: types.object
};

// Default value for props

BaseStepsBody.defaultProps = {
  className: ''
};

// ----------------

export default function BaseStepsBody(props) {
  const { className, style, children } = props;

  return (
    <div className={`base-steps-body ${className}`} style={style}>
      {children}
    </div>
  );
}
