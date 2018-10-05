import React from 'react';
import ReactSVG from 'react-svg';
import types from 'prop-types';
import classNames from 'classnames';

// Components

import { Loader } from './../../../components';

// Style

import './styles.scss';

// Image and icons

import arrowDown from '../../../static/img/icons/arrow_blue.svg';

// ----------------

// Type of props

LoadMoreButton.propTypes = {
  next: types.string,
  loaderSize: types.string,
  className: types.string,
  children: types.string,
  onClick: types.func,
  style: types.object
};

// Default value for props

LoadMoreButton.defaultProps = {
  className: '',
  color: 'white'
};

// Modify styles

const modify = props =>
  classNames({
    [`load-more-button__wrapper--${props.color}`]: props.color
  });

// ----------------

export default function LoadMoreButton(props) {
  const { networkProcess, loaderSize, className, children, onClick, style, next } = props;

  const status = networkProcess && networkProcess.status;
  const button = !next ? null : (
    <button
      className={`load-more-button__wrapper ${modify(props)} ${className}`}
      onClick={status === 'loading' ? null : () => onClick({ url: next })}
      style={style}
    >
      {status === 'loading' ? (
        <Loader color={props.color === 'white' ? 'grey' : 'white'} size={loaderSize} />
      ) : (
        <div className="load-more-button__icon">
          <span>{children} </span>
          <ReactSVG src={arrowDown} />
        </div>
      )}
    </button>
  );

  return button;
}
