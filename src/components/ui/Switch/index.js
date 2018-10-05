import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Components

import { FieldWrapper } from '../../../components';

// Styles

import './styles.scss';

// ----------------

// Type of props

Switch.propTypes = {
  className: types.string,
  style: types.object,
  list: types.array,
  ctx: types.object
};

// Default value for props

Switch.defaultProps = {
  className: ''
};

const clickHandler = (ctx, item, name) => {
  ctx.setState(prevState => ({
    ...prevState,
    form: {
      ...prevState.form,
      [name]: item.itemName
    }
  }));
};

// Modify styles

const modifyFieldWrapper = props =>
  classNames({
    'ui-field-wrapper__block--full-width': props.fullWidth
  });

const modifyItem = (selectedOption, name, ctx) =>
  classNames({ 'switch--checked': ctx.state.form[name] === selectedOption });

const modifyActiveElem = (selectedOption, name, ctx) =>
  classNames({ 'switch__active-elem--checked': ctx.state.form[name] === selectedOption });

// ----------------

export default function Switch(props) {
  const { className, style, list, ctx, name, title, error } = props;
  const selectedOption = list[0].itemName;

  return (
    <FieldWrapper
      title={title}
      error={error || ctx.state.status[name]}
      className={`${modifyFieldWrapper(props)} ${className}`}
    >
      <ul className={`switch ${modifyItem(selectedOption, name, ctx)} ${className}`} style={style}>
        {list.map(item => (
          <li
            className={`switch__item ${className}`}
            callback={item.callBack}
            onClick={() => clickHandler(ctx, item, name)}
            key={item.itemName}
            name={item.itemName}
          >
            {item.title}
          </li>
        ))}
        <div className={`switch__active-elem ${modifyActiveElem(selectedOption, name, ctx)}`}>
          <span>{ctx.state.form[name]}</span>
        </div>
      </ul>
    </FieldWrapper>
  );
}
