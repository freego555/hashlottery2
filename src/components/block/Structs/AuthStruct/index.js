import React from 'react';
import types from 'prop-types';
import ReactSVG from 'react-svg';

// Constants

import { appVersion } from '../../../../constants';

// Styles

import './styles.scss';

// Image and icons

import authImage from '../../../../static/img/login_pic.png';
import logo from '../../../../static/img/Lifeline-Logo.svg';

// ----------------

// Type of props

AuthStruct.propTypes = {
  className: types.string,
  children: types.object,
  style: types.object
};

// Default value for props

AuthStruct.defaultProps = { className: '' };

// ----------------

export default function AuthStruct(props) {
  const { className, style, children } = props;

  return (
    <div className={`auth-structure ${className}`} style={style}>
      <div
        className="auth-structure__image-wrapper"
        style={{ backgroundImage: `url("${authImage}")` }}
      />
      <div className="auth-structure__form-block">
        <div className="auth-structure__logo-wrapper">
          <ReactSVG src={logo} />
        </div>
        {children}
        <p className="auth-structure__app-version">{`App version: ${appVersion}`}</p>
      </div>
    </div>
  );
}
