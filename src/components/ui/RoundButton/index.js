import React from 'react';
import { Link } from 'react-router-dom';
import types from 'prop-types';
import classNames from 'classnames';

// Styles

import './styles.scss';

// ----------------

// Type of props

RoundButton.propTypes = {
  url: types.string,
  onClick: types.func,
  className: types.string,
  style: types.object
};

// Default value for props

RoundButton.defaultProps = {
  className: ''
};

// Modify styles

const modify = props => classNames({});

// ----------------

export default function RoundButton(props) {
  const { className, style, linkTo, onClick } = props;
  let button = null;

  if (onClick && typeof onClick === 'function') {
    button = (
      <button
        className={`round-button ${modify(props)} ${className}`}
        onClick={onClick}
        style={style}
      />
    );
  } else {
    button = (
      <Link
        to={linkTo || '/'}
        className={`round-button ${modify(props)} ${className}`}
        style={style}
      />
    );
  }
  return button;
}
