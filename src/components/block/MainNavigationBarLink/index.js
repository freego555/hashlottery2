import React from 'react';
import types from 'prop-types';
import ReactSVG from 'react-svg';
import { NavLink } from 'react-router-dom';

// Styles

import './styles.scss';

// ----------------

// Type of props

MainNavigationBarLink.propTypes = {
  className: types.string,
  style: types.object,
  item: types.object
};

// Default value for props

MainNavigationBarLink.defaultProps = {
  className: ''
};

// ----------------

export default function MainNavigationBarLink(props) {
  const { className, style, item } = props;

  return (
    <NavLink
      className={`nav-bar-link ${className}`}
      activeClassName="nav-bar-link--active"
      style={style}
      to={item.url}
    >
      <div className="nav-bar-link__block">
        <div className="nav-bar-link__icon-wrapper">
          <ReactSVG src={item.icon} />
        </div>
        <p className="nav-bar-link__label">{item.label}</p>
      </div>
    </NavLink>
  );
}
