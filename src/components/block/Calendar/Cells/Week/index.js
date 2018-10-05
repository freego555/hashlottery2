import React from 'react';
import types from 'prop-types';

// Styles

import './styles.scss';

// ----------------

// Type of props

WeekCell.propTypes = {
  className: types.string,
  children: types.node.isRequired,
  style: types.object
};

// Default value for props

WeekCell.defaultProps = {
  className: ''
};

// ----------------

export default function WeekCell(props) {
  const { className, style, children } = props;

  return (
    <div className={`calendar-week-cell ${className}`} style={style}>
      {children}
    </div>
  );
}
