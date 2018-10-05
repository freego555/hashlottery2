import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Components

import { FieldWrapper } from '../../../components';

// Modules

import deleteProps from '../../../modules/deleteProps';

// Styles

import './styles.scss';

// ----------------

// Type of props

Input.propTypes = {
  customSideBlock: types.object,
  withOutBorder: types.bool,
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

Input.defaultProps = {
  className: ''
};

// Modify styles

const modify = (props, error) =>
  classNames({
    'simple-input__input--default-paddings': !props.customSideBlock,
    'simple-input__input--withOutBorder': props.withOutBorder,
    'simple-input__input--full-width': props.fullWidth,
    'simple-input__input--error': error
  });

const modifyFieldWrapper = props =>
  classNames({
    'ui-field-wrapper__block--full-width': props.fullWidth
  });

// ----------------

export default function Input(props) {
  const { customSideBlock, className, title, error, name, ctx } = props;

  return (
    <FieldWrapper
      title={title}
      error={error || ctx.state.status[name]}
      className={`${modifyFieldWrapper(props)} ${className}`}
    >
      <div className="simple-input__wrapper">
        <input
          className={`simple-input__input ${modify(
            props,
            error || ctx.state.status[name]
          )} ${className}`}
          onChange={ctx.changeHandler}
          onFocus={ctx.focusHandler}
          onBlur={ctx.blurHandler}
          value={ctx.state.form[name]}
          {...deleteProps(props, [
            'customSideBlock',
            'withOutBorder',
            'className',
            'fullWidth',
            'title',
            'error',
            'ctx'
          ])}
        />
        {customSideBlock && <div className="simple-input__side-block">{customSideBlock}</div>}
      </div>
    </FieldWrapper>
  );
}
