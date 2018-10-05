import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Styles

import './styles.scss';

// ----------------

// Type of props

WeekGrid.propTypes = {
  activeDate: types.string,
  className: types.string,
  children: types.node.isRequired,
  style: types.object,
  dates: types.array
};

// Default value for props

WeekGrid.defaultProps = {
  className: ''
};

// Modify styles

const modify = (date, activeDate) =>
  classNames({
    'calendar-week-grid__date--active': date === activeDate
  });

// ----------------

export default function WeekGrid(props) {
  const { className, style, children, dates, activeDate } = props;

  return (
    <div className={`calendar-week-grid ${className}`} style={{ style }}>
      {dates.map(date => (
        <div className={`calendar-week-grid__date ${modify(date, activeDate)}`} key={date}>
          {date}
        </div>
      ))}
      {children}
    </div>
  );
}
