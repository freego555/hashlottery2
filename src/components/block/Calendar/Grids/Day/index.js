import React from 'react';
import types from 'prop-types';

// Styles

import './styles.scss';

// ----------------

// Type of props

DayGrid.propTypes = {
  className: types.string,
  children: types.node.isRequired,
  style: types.object,
  dates: types.array
};

// Default value for props

DayGrid.defaultProps = {
  className: ''
};

// ----------------

export default function DayGrid(props) {
  const { className, style, children, dates } = props;

  return (
    <div className={`calendar-day-grid ${className}`} style={{ style }}>
      {dates.map(date => (
        <div className="calendar-day-grid__date" key={date}>
          {date}
        </div>
      ))}
      {children}
    </div>
  );
}
