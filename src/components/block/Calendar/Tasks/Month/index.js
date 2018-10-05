import React from 'react';
import types from 'prop-types';

// Styles

import './styles.scss';

// ----------------

// Type of props

MonthTask.propTypes = {
  className: types.string,
  status: types.string,
  style: types.object,
  title: types.string,
  time: types.string
};

// Default value for props

MonthTask.defaultProps = {
  className: '',
  status: 'DONE',
  title: 'Title',
  time: '00:00'
};

// ----------------

export default function MonthTask(props) {
  const { className, style, time, title, status } = props;
  let color;

  switch (status) {
    case 'UNDN': {
      color = '#EB1A55';
      break;
    }
    case 'SUSP': {
      color = '#4f5fe8';
      break;
    }
    case 'DONE': {
      color = '#39D6A9';
      break;
    }
    case 'STOP': {
      color = '#f1c40f';
      break;
    }
    case 'DISP': {
      color = '#8449BE';
      break;
    }
  }

  return (
    <div className={`month-task ${className}`} style={style}>
      <div className="month-task__line" style={{ background: color }} />
      <div className="month-task__title">{title}</div>
      <time className="month-task__time">{time}</time>
    </div>
  );
}
