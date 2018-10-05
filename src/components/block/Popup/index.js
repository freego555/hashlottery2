import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Components

import { Outside } from '../../../components';

// Styles

import './styles.scss';

// ----------------

// Type of props

Popup.propTypes = {
  className: types.string,
  children: types.object.isRequired,
  onClose: types.func.isRequired,
  isOpen: types.bool.isRequired,
  style: types.object
};

// Default value for props

Popup.defaultProps = {
  className: ''
};

// Modify styles

const modify = props =>
  classNames({
    'popup__window-wrapper--open': props.isOpen
  });

const modalModify = props =>
  classNames({
    'popup__modal--open': props.isOpen
  });

// ----------------

export default function Popup(props) {
  const { className, children, onClose, isOpen, style } = props;

  return isOpen ? (
    <div className={`popup__window-wrapper ${modify(props)} ${className}`} style={style}>
      <div className="popup__modal-margin-wrapper">
        <Outside onOutsideClick={onClose}>
          <div className={`popup__modal ${modalModify(props)}`}>
            <div className="popup__modal-inner-block">{children}</div>
          </div>
        </Outside>
      </div>
    </div>
  ) : null;
}
