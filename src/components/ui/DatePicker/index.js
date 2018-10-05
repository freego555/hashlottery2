import React from 'react';
import types from 'prop-types';
import ReactSVG from 'react-svg';
import classNames from 'classnames';

// Components

import { FieldWrapper } from '../../../components';

// Modules

import deleteProps from '../../../modules/deleteProps';

// Styles

import './styles.scss';

// Image and icons

import dateRangeIcon from '../../../static/img/icons/date_range_icon.svg';

// ----------------

// Type of props

DatePicker.propTypes = {
  placeholder: types.string,
  className: types.string,
  style: types.object,
  title: types.string,
  value: types.string,
  error: types.string,
  name: types.string.isRequired,
  ctx: types.object.isRequired
};

// Default value for props

DatePicker.defaultProps = {
  className: ''
};

// Modify styles

const modify = (props, error) =>
  classNames({
    'simple-datepicker__datepicker--full-width': props.fullWidth,
    'simple-datepicker__datepicker--error': error
  });

// ----------------

export default function DatePicker(props) {
  const { className, title, error, name, ctx } = props;

  return (
    <FieldWrapper title={title} error={error || ctx.state.status[name]} className={`${className}`}>
      <div className="simple-datepicker__wrapper">
        <input
          className={`simple-datepicker__date-picker ${modify(
            props,
            error || ctx.state.status[name]
          )} ${className}`}
          // value={ctx.state.form[name]}
          type="date"
          {...deleteProps(props, ['ctx', 'className', 'fullWidth', 'title', 'error'])}
        />
        <div className="simple-datepicker__side-block">
          <ReactSVG className="simple-datepicker__icon-wrapper" src={dateRangeIcon} />
        </div>
      </div>
    </FieldWrapper>
  );
}
