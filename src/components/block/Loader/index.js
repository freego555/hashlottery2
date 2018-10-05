import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Style

import './styles.scss';

// ----------------

// Type of props

Loader.propTypes = {
  className: types.string,
  style: types.object,
  color: types.string,
  size: types.string
};

// Default value for props

Loader.defaultProps = {
  className: '',
  size: 'normal'
};

// Modify styles

const modify = props =>
  classNames({
    [`loader__wrapper--${props.color}`]: props.color,
    [`loader__wrapper--${props.size}`]: props.size
  });

// ----------------

export default function Loader(props) {
  const { className, style } = props;

  return (
    <p className={`loader__wrapper ${modify(props)} ${className}`} style={style}>
      <span />
      <span />
      <span />
    </p>
  );
}
