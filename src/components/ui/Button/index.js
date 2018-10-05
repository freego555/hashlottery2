import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Components

import { Loader } from './../../../components';

// Style

import './styles.scss';

// ----------------

// Type of props

Button.propTypes = {
  loaderSize: types.string,
  className: types.string,
  children: types.string,
  onClick: types.func,
  status: types.oneOfType([types.string, types.bool]),
  style: types.object
};

// Default value for props

Button.defaultProps = {
  className: ''
};

// Modify styles

const modify = props =>
  classNames({
    [`rectangular-button__wrapper--${props.color}`]: props.color
  });

// ----------------

export default function Button(props) {
  const { className, style, status, onClick, children, loaderSize } = props;

  return (
    <button
      className={`rectangular-button__wrapper ${modify(props)} ${className}`}
      onClick={status === 'loading' ? null : onClick}
      style={style}
    >
      {status === 'loading' ? (
        <Loader color={props.color === 'white' ? 'grey' : 'white'} size={loaderSize} />
      ) : (
        children
      )}
    </button>
  );
}
