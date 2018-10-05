import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Constants

import { _global } from '../../../constants';

// Components

import { IconButton, MultiLanguageForm } from '../../../components';

// Styles

import './styles.scss';

// ----------------

// Type of props

ProfileMenu.propTypes = {
  toggleProfileMenu: types.func,
  isProfileMenuOpen: types.bool,
  className: types.string,
  style: types.object,
  ctx: types.object
};

// Default value for props

ProfileMenu.defaultProps = {
  className: ''
};

// Modify styles

const modify = props =>
  classNames({
    'profile-menu--open': props.isProfileMenuOpen
  });

// ----------------

export default function ProfileMenu(props) {
  const { toggleProfileMenu, isProfileMenuOpen, className, style } = props;
  const { lan } = _global;

  return (
    <React.Fragment>
      {isProfileMenuOpen && <div onClick={toggleProfileMenu} className="profile-menu__substrate" />}
      <div className={`profile-menu ${modify(props)} ${className}`} style={style}>
        <div className="profile-menu__title-block">
          <p className="profile-menu__user-name">Kevin Spacey</p>
          <p className="profile-menu__logout-btn" onClick={() => {}}>
            {lan.ui.button.logout}
          </p>
        </div>
        <div className="profile-menu__language-block">
          <p className="profile-menu__radio-btns-title">{lan.ui.userProfileMenu.appLanguage}</p>
          <MultiLanguageForm />
        </div>
        <div className="profile-menu__close-btn-wrapper">
          <IconButton onClick={toggleProfileMenu} mode="cancel" mobileMode />
        </div>
      </div>
    </React.Fragment>
  );
}
