import React from 'react';
import types from 'prop-types';
import ReactSVG from 'react-svg';

// Constants

import { _global } from '../../../constants';

// Components

import { MainNavigationBarLink } from '../../../components';

// Styles

import './styles.scss';

// Image and icons

import dashboardIcon from '../../../static/img/icons/dashboard_icon.svg';
import patientsIcon from '../../../static/img/icons/patients_icon.svg';
import messagesIcon from '../../../static/img/icons/messages_icon.svg';
import archiveIcon from '../../../static/img/icons/archive_icon.svg';
import profileIcon from '../../../static/img/icons/profile_icon.svg';
import smallLogo from '../../../static/img/LifeLine_logo-white.svg';

// ----------------

// Type of props

MainNavigationBar.propTypes = {
  toggleProfileMenu: types.func,
  className: types.string,
  style: types.object
};

// Default value for props

MainNavigationBar.defaultProps = {
  className: ''
};

// ----------------

export default function MainNavigationBar(props) {
  const { className, style, toggleProfileMenu } = props;
  const { lan } = _global;

  const NAV_LINKS = [
    {
      label: lan.ui.navigationLinks.dashboard,
      icon: dashboardIcon,
      url: '/main/dashboard',
      access: true
    },
    {
      label: lan.ui.navigationLinks.patients,
      icon: patientsIcon,
      url: '/main/patients',
      access: true
    },
    {
      label: lan.ui.navigationLinks.messages,
      icon: messagesIcon,
      url: '/main/messages',
      access: true
    },
    {
      label: lan.ui.navigationLinks.archive,
      icon: archiveIcon,
      url: '/main/archive',
      access: true
    }
  ];

  return (
    <nav className={`main-navigation-bar ${className}`} style={style}>
      <div className="main-navigation-bar__horizontal-wrapper">
        <div className="main-navigation-bar__logo-wrapper">
          <ReactSVG src={smallLogo} />
        </div>
        <div className="main-navigation-bar__links-block">
          {NAV_LINKS.filter(item => item.access).map(item => (
            <MainNavigationBarLink key={item.url} item={item} />
          ))}
        </div>
        <div onClick={toggleProfileMenu} className="main-navigation-bar__profile-wrapper">
          <div className="main-navigation-bar__profile">
            <div className="main-navigation-bar__profile-icon-wrapper">
              <ReactSVG src={profileIcon} />
            </div>
            <p className="main-navigation-bar__profile-label">{lan.ui.navigationLinks.profile}</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
