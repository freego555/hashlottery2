import React from 'react';
import types from 'prop-types';
import ReactSVG from 'react-svg';

// Icons

import arrow from '../../../../static/img/icons/chevron_right.svg';

// Styles

import './styles.scss';

// ----------------

// Type of props

CalendarNav.propTypes = {
  className: types.string,
  onNext: types.func.isRequired,
  onPrev: types.func.isRequired,
  style: types.object,
  date: types.string.isRequired
};

// Default value for props

CalendarNav.defaultProps = {
  className: '',
  date: 'Date'
};

// ----------------

export default function CalendarNav(props) {
  const { className, style, onNext, onPrev, date } = props;

  return (
    <div className={`calendar-nav ${className}`} style={style}>
      <div className="calendar-nav__button calendar-nav__button--left" onClick={onPrev}>
        <ReactSVG src={arrow} />
      </div>
      <div className="calendar-nav__date">{date}</div>
      <div className="calendar-nav__button" onClick={onNext}>
        <ReactSVG src={arrow} />
      </div>
    </div>
  );
}
