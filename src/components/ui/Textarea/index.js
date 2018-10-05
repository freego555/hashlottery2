import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Components

import { FieldWrapper } from '../../../components';

// Modules

import deleteProps from '../../../modules/deleteProps';

// Style

import './styles.scss';

// ----------------

// Type of props

Textarea.propTypes = {
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

Textarea.defaultProps = {
  className: ''
};

// Modify styles

const modify = (props, error) =>
  classNames({
    'simple-textarea__textarea--full-width': props.fullWidth,
    'simple-textarea__textarea--error': error
  });

const modifyFieldWrapper = props =>
  classNames({
    'ui-field-wrapper__block--full-width': props.fullWidth
  });

// ----------------

export default function Textarea(props) {
  const { className, title, error, name, ctx } = props;

  return (
    <FieldWrapper
      title={title}
      error={error || ctx.state.status[name]}
      className={`${modifyFieldWrapper(props)} ${className}`}
    >
      <div className="simple-textarea__wrapper">
        <textarea
          className={`simple-textarea__textarea ${modify(
            props,
            error || ctx.state.status[name]
          )} ${className}`}
          onChange={ctx.changeHandler}
          onFocus={ctx.focusHandler}
          onBlur={ctx.blurHandler}
          value={ctx.state.form[name]}
          {...deleteProps(props, [
            'ctx',
            'customSideBlock',
            'className',
            'title',
            'error',
            'fullWidth'
          ])}
        />
      </div>
    </FieldWrapper>
  );
}
