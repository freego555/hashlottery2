import React from 'react';
import types from 'prop-types';

// Constants

import { _global } from '../../../constants';

// Components

import { MobileAdaptiveButton, IconButton } from '../../../components';

// Styles

import './styles.scss';

// ----------------

// Type of props

MainHeader.propTypes = {
  toggleAsideBlock: types.func,
  isAsideOpen: types.bool,
  className: types.string,
  style: types.object,
  aside: types.bool
};

// Default value for props

MainHeader.defaultProps = {
  className: ''
};

// ----------------

export default function MainHeader(props) {
  const { className, style, isAsideOpen, toggleAsideBlock, aside } = props;
  const { lan } = _global;

  return (
    <header className={`main-header ${className}`} style={style}>
      <IconButton onClick={() => {}} mode="back" withTitle />
      <div className="main-header__info-block">
        <p>{lan.ui.navigationLinks.patients}</p>
        <p>Jonathan Anderson</p>
      </div>
      <div className="main-header__horizontal-wrapper">
        <IconButton onClick={() => {}} mode="cancel" withTitle />
        <IconButton onClick={() => {}} mode="refresh" withTitle titleFirst />
        {aside && (
          <MobileAdaptiveButton
            isBlockOpen={isAsideOpen}
            onClick={toggleAsideBlock}
            style={{ marginLeft: '24px' }}
          />
        )}
      </div>
    </header>
  );
}
