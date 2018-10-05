import React from 'react';
import types from 'prop-types';

// Styles

import './styles.scss';

// ----------------

// Type of props

MonthGrid.propTypes = {
  className: types.string,
  children: types.node.isRequired,
  style: types.object,
  dates: types.array
};

// Default value for props

MonthGrid.defaultProps = {
  className: ''
};

// ----------------

export default function MonthGrid(props) {
  const { className, style, children, dates } = props;

  return (
    <div className={`calendar-month-grid ${className}`} style={{ style }}>
      {dates.map(date => (
        <div className="calendar-month-grid__date" key={date}>
          {date}
        </div>
      ))}
      {children}
    </div>
  );
}
