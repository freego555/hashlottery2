import React from 'react';
import types from 'prop-types';
import ReactSVG from 'react-svg';

// Styles

import './styles.scss';

// Image and icons

import visibleOffIcon from '../../../static/img/icons/visibility_off.svg';
import visibleOnIcon from '../../../static/img/icons/visibility_on.svg';

// ----------------

// Type of props

Visible.propTypes = {
  visible: types.bool,
  onClick: types.func
};

// ----------------

export default function Visible(props) {
  const { onClick, visible } = props;

  return (
    <div className="visible-icon" onClick={onClick}>
      <ReactSVG src={visible ? visibleOffIcon : visibleOnIcon} />
    </div>
  );
}
