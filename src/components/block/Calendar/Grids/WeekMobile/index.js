import React from 'react';
import types from 'prop-types';

// Styles

import './styles.scss';

// ----------------

// Type of props

WeekMobileGrid.propTypes = {
  className: types.string,
  children: types.node.isRequired,
  style: types.object
};

// Default value for props

WeekMobileGrid.defaultProps = {
  className: ''
};

// ----------------

export default function WeekMobileGrid(props) {
  const { className, style, children } = props;

  return (
    <div className={`calendar-week-mobile-grid ${className}`} style={{ style }}>
      {children}
    </div>
  );
}
