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

import chevronIcon from '../../../static/img/icons/chevron_right.svg';

// ----------------

// Type of props

Select.propTypes = {
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

Select.defaultProps = {
  className: ''
};

// Modify styles

const modify = (props, error) =>
  classNames({
    'simple-select__select--full-width': props.fullWidth,
    'simple-select__select--error': error
  });

const modifyFieldWrapper = props =>
  classNames({
    'ui-field-wrapper__block--full-width': props.fullWidth
  });

// ----------------

export default function Select(props) {
  const { className, title, error, name, ctx, placeholder, options } = props;

  return (
    <FieldWrapper
      title={title}
      error={error || ctx.state.status[name]}
      className={`${modifyFieldWrapper(props)} ${className}`}
    >
      <div className="simple-select__wrapper">
        <select
          className={`simple-select__select ${modify(
            props,
            error || ctx.state.status[name]
          )} ${className}`}
          {...deleteProps(props, ['ctx', 'className', 'fullWidth', 'title', 'error'])}
        >
          <option value={placeholder} hidden>
            {placeholder}
          </option>
          {options.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <div className="simple-select__side-block">
          <ReactSVG className="simple-select__icon-wrapper" src={chevronIcon} />
        </div>
      </div>
    </FieldWrapper>
  );
}
