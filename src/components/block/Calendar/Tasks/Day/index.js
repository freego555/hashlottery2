import React from 'react';
import types from 'prop-types';
import ReactSVG from 'react-svg';
import classNames from 'classnames';

// Icons

import arrow from '../../../../../static/img/icons/chevron_right.svg';
import icon from '../../../../../static/img/icons/pulse-line.svg';

// Styles

import './styles.scss';

// ----------------

// Type of props

DayTask.propTypes = {
  className: types.string,
  status: types.string,
  style: types.object,
  title: types.string,
  time: types.string
};

// Default value for props

DayTask.defaultProps = {
  className: '',
  status: 'DONE',
  title: 'Title',
  time: '00:00'
};

// Modify styles

const modifySVG = status =>
  classNames({
    'day-task__arrow--color-red': status === 'UNDN',
    'day-task__arrow--color-blue': status === 'SUSP',
    'day-task__arrow--color-green': status === 'DONE',
    'day-task__arrow--color-yellow': status === 'STOP',
    'day-task__arrow--color-purple': status === 'DISP'
  });

// ----------------

export default function DayTask(props) {
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
    <div className={`day-task ${className}`} style={style}>
      <div className="day-task__category" style={{ background: color }}>
        <ReactSVG src={icon} />
      </div>
      <time className="day-task__time">{time}</time>
      <div className="day-task__title">{title}</div>
      <div className={`day-task__arrow ${modifySVG(status)}`}>
        <ReactSVG src={arrow} />
      </div>
    </div>
  );
}
