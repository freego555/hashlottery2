import React from 'react';
import types from 'prop-types';
import ReactSVG from 'react-svg';

// Icons

import icon from '../../../../../static/img/icons/pulse-line.svg';

// Styles

import './styles.scss';

// ----------------

// Type of props

WeekTask.propTypes = {
  className: types.string,
  category: types.string,
  status: types.string,
  style: types.object,
  title: types.string,
  time: types.string
};

// Default value for props

WeekTask.defaultProps = {
  className: '',
  category: '',
  status: 'DONE',
  title: 'Title',
  time: '00:00'
};

// ----------------

export default function WeekTask(props) {
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
    <div className={`week-task ${className}`} style={style}>
      <div className="week-task__category" style={{ background: color }}>
        <ReactSVG src={icon} />
      </div>
      <div className="week-task__title">{title}</div>
      <time className="week-task__time">{time}</time>
    </div>
  );
}
