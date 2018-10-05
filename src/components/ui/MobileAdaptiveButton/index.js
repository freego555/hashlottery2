import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Styles

import './styles.scss';

// ----------------

// Type of props

MobileAdaptiveButton.propTypes = {
  isBlockOpen: types.bool,
  className: types.string,
  onClick: types.func,
  style: types.object
};

// Default value for props

MobileAdaptiveButton.defaultProps = {
  className: ''
};

// Modify styles

const modify = props =>
  classNames({
    'adaptive-btn--adaptive': props.isBlockOpen
  });

// ----------------

export default function MobileAdaptiveButton(props) {
  const { className, style, onClick } = props;

  return (
    <button
      className={`adaptive-btn ${modify(props)} ${className}`}
      onClick={onClick}
      style={style}
    >
      <span />
      <span />
      <span />
    </button>
  );
}
