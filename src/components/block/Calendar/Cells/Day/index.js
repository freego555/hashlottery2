import React from 'react';
import types from 'prop-types';

// Constants

import { _global } from '../../../../../constants';

// Styles

import './styles.scss';

// ----------------

// Type of props

DayCell.propTypes = {
  className: types.string,
  children: types.node.isRequired,
  style: types.object
};

// Default value for props

DayCell.defaultProps = {
  className: ''
};

// ----------------

export default function DayCell(props) {
  const { className, style, children } = props;

  return (
    <div className={`calendar-day-cell ${className}`} style={style}>
      {children.length ? (
        children
      ) : (
        <p className="calendar-day-cell__empty">
          <span>{_global.lan.calendar.noTasks}</span>
        </p>
      )}
    </div>
  );
}
