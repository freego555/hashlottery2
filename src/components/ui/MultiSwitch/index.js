import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Styles

import './styles.scss';

// ----------------

// Type of props

MultiSwitch.propTypes = {
  className: types.string,
  style: types.object,
  list: types.array,
  ctx: types.object
};

// Default value for props

MultiSwitch.defaultProps = {
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

  if (item.callBack) {
    item.callBack();
  }
};

// Modify styles

const modifyItemStyle = (itemName, name, ctx) =>
  classNames({ 'multi-switcher__item--active': ctx.state.form[name] === itemName });

// ----------------

export default function MultiSwitch(props) {
  const { className, style, list, ctx, name } = props;
  return (
    <ul className={`multi-switcher ${className}`} style={style}>
      {list.map(item => (
        <li
          className={`multi-switcher__item ${modifyItemStyle(
            item.itemName,
            name,
            ctx
          )} ${className}`}
          callback={item.callBack}
          onClick={() => clickHandler(ctx, item, name)}
          key={item.itemName}
          name={item.itemName}
        >
          {item.title}
        </li>
      ))}
    </ul>
  );
}
