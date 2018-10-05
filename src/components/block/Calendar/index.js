import React from 'react';
import types from 'prop-types';
import moment from 'moment';
import ReactSVG from 'react-svg';

// Components

import CalendarNav from './Nav';

// Icons

import calendarIcon from '../../../static/img/icons/calendar.svg';

// Styles

import './styles.scss';

// ----------------

export default class Calendar extends React.Component {
  // Type of props

  static propTypes = {
    className: types.string,
    style: types.object,
    tasks: types.array.isRequired, // Array of tasks
    view: types.oneOf(['day', 'week', 'month']).isRequired,
    grid: types.func.isRequired,
    cell: types.func.isRequired,
    task: types.func.isRequired // Task component
  };

  // Default value for props

  static defaultProps = {
    className: '',
    tasks: []
  };

  // -------- Methods --------

  // Constructor

  constructor(props) {
    super(props);

    const currentDate = moment();

    // State of component

    this.state = {
      currentDate
    };

    switch (props.view) {
      case 'day': {
        this.state.viewDate = currentDate.clone();
        this.getDates = this.getDayDates;
        break;
      }

      case 'week': {
        this.state.viewDate = currentDate.clone().startOf('isoWeek');
        this.getDates = this.getWeekDates;
        break;
      }

      case 'month': {
        this.state.viewDate = currentDate.clone().startOf('month');
        this.getDates = this.getMonthDates;
        break;
      }
    }

    // Bind methods, that are going to be called as an event handlers

    this.nextDate = this.nextDate.bind(this);
    this.prevDate = this.prevDate.bind(this);
  }

  // Get dates for day view

  getDayDates() {
    const viewDate = this.state.viewDate;
    return [viewDate.clone(), viewDate.clone().add(1, 'days')];
  }

  // Get dates for week view

  getWeekDates() {
    const viewDate = this.state.viewDate;
    const dates = [];

    for (let i = 0; i < 7; i++) {
      dates.push(viewDate.clone().add(i, 'days'));
    }

    return dates;
  }

  // Get dates for month view

  getMonthDates() {
    const viewDate = this.state.viewDate;
    const dates = [];
    const daysInMonth = viewDate.daysInMonth();

    for (let i = 0; i < daysInMonth; i++) {
      dates.push(viewDate.clone().add(i, 'days'));
    }

    if (viewDate.isoWeekday() > 1) {
      for (let i = 1; i < viewDate.isoWeekday(); i++) {
        dates.unshift(viewDate.clone().subtract(i, 'days'));
      }
    }

    const lastDate = dates[dates.length - 1];
    const endDayOfWeek = lastDate.isoWeekday();

    if (endDayOfWeek !== 7) {
      for (let i = 1; i <= 7 - endDayOfWeek; i++) {
        dates.push(lastDate.clone().add(i, 'days'));
      }
    }

    return dates;
  }

  // Get tasks for day

  getTasks(date) {
    const tasks = this.props.tasks.filter(task => date.isSame(task.date, 'day'));

    const sortedTasks = tasks.sort((a, b) => {
      return moment(a.date + ' ' + a.time).isBefore(b.date + ' ' + b.time) ? -1 : 1;
    });

    return sortedTasks.map((task, i) => (
      <div
        className={`calendar__task calendar__task--${this.props.view}`}
        style={{ transform: `translateY(${(i + 1) * 38}px)` }}
        key={task.id}
      >
        <this.props.task
          status={task.status}
          title={task.task.name}
          time={moment(task.date + ' ' + task.time).format('HH:mm')}
        />
      </div>
    ));
  }

  // Get period

  getPeriod(dates) {
    if (this.props.view !== 'month') {
      return `${moment(dates[0]).format('MMM DD')} - ${moment(dates[dates.length - 1]).format(
        'DD, YYYY'
      )} `;
    }

    return `${this.state.viewDate.format('MMMM, YYYY')}`;
  }

  // Get calendar dates

  getCalendarDates(dates) {
    if (this.props.view === 'day') {
      return dates.map(date => ({
        displayDate: date.clone().format('dddd'),
        date: date.clone()
      }));
    }

    if (this.props.view === 'week') {
      return dates.map(date => ({
        displayDate: date.clone().format('DD ddd'),
        date: date.clone()
      }));
    }

    if (this.props.view === 'month') {
      const calendarDates = [];

      for (let i = 0; i < 7; i++) {
        calendarDates.push({
          displayDate: dates[i].clone().format('ddd'),
          date: dates[i].clone()
        });
      }

      return calendarDates;
    }
  }

  // Get active date

  getActiveDate(dates) {
    return dates.find(date => this.state.currentDate.isSame(date.date, 'day'));
  }

  // Next date

  nextDate() {
    this.setState(prevState => {
      const viewDate = this.state.viewDate.clone().add(1, this.props.view);

      if (!viewDate.isSame(this.state.viewDate, 'month')) {
        this.props.fetchTasks({ date: viewDate.format('YYYY-MM-DD') });
      }

      return { viewDate };
    });
  }

  // Prev date

  prevDate() {
    this.setState(prevState => {
      const viewDate = this.state.viewDate.clone().subtract(1, this.props.view);

      if (!viewDate.isSame(this.state.viewDate, 'month')) {
        this.props.fetchTasks({ date: viewDate.format('YYYY-MM-DD') });
      }

      return { viewDate };
    });
  }

  // Render

  render() {
    const { className, style, grid: Grid, cell: Cell, networkProcess } = this.props;
    const dates = this.getDates();
    const calendarDates = this.getCalendarDates(dates);
    const activeDate = this.getActiveDate(calendarDates);

    return (
      <div className={`calendar ${className}`} style={style}>
        <CalendarNav
          className="calendar__nav-wrapper"
          onPrev={this.prevDate}
          onNext={this.nextDate}
          date={this.getPeriod(dates)}
        />
        {networkProcess && networkProcess.status === 'loading' ? (
          <div className="calendar__loading-icon">
            <ReactSVG src={calendarIcon} />
          </div>
        ) : (
          <Grid
            activeDate={activeDate ? activeDate.displayDate : ''}
            className="calendar__grid-wrapper"
            dates={calendarDates.map(date => date.displayDate)}
          >
            {dates.map((date, i) => (
              <Cell
                isCurrentMonth={this.state.viewDate.isSame(date, 'month')}
                isActiveDate={this.state.currentDate.isSame(date, 'day')}
                dayOfWeek={date.format('ddd')}
                date={date.format('DD')}
                key={i}
              >
                {this.getTasks(date)}
              </Cell>
            ))}
          </Grid>
        )}
      </div>
    );
  }
}
