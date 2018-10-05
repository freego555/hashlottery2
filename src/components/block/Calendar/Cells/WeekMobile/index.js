import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Constants

import { _global } from '../../../../../constants';

// Styles

import './styles.scss';

// ----------------

// Type of props

WeekMobileCell.propTypes = {
  className: types.string,
  children: types.node.isRequired,
  style: types.object
};

// Default value for props

WeekMobileCell.defaultProps = {
  className: ''
};

// Modify styles

const modify = props =>
  classNames({
    'calendar-mobile-week-cell--active': props.isActiveDate
  });

// ----------------

export default function WeekMobileCell(props) {
  const { className, style, children, date, dayOfWeek } = props;

  return (
    <div className={`calendar-mobile-week-cell ${modify(props)} ${className}`} style={style}>
      <div className="calendar-mobile-week-cell__date">
        <div className="calendar-mobile-week-cell__day">{date}</div>
        <div className="calendar-mobile-week-cell__day-of-week">{dayOfWeek}</div>
      </div>
      <div className="calendar-mobile-week-cell__tasks">
        {children.length ? (
          children
        ) : (
          <p className="calendar-mobile-week-cell__empty">
            <span>{_global.lan.calendar.noTasks}</span>
          </p>
        )}
      </div>
    </div>
  );
}
