import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Styles

import './styles.scss';

// ----------------

// Type of props

MonthCell.propTypes = {
  isActiveDate: types.bool,
  className: types.string,
  children: types.node.isRequired,
  style: types.object
};

// Default value for props

MonthCell.defaultProps = {
  className: ''
};

// Modify styles

const modify = props =>
  classNames({
    'calendar-month-cell--active': props.isActiveDate,
    'calendar-month-cell--disable': !props.isCurrentMonth
  });

// ----------------

export default function MonthCell(props) {
  const { className, style, children, date } = props;
  const childrenCount = children.length;

  return (
    <div className={`calendar-month-cell ${modify(props)} ${className}`} style={style}>
      <div className="calendar-month-cell__date">
        <span>{date}</span>
      </div>
      <div className="calendar-month-cell__task-list">{children.slice(0, 2)}</div>
      {childrenCount > 2 && (
        <div className="calendar-month-cell__more">{`+ ${childrenCount - 2} more`}</div>
      )}
    </div>
  );
}
