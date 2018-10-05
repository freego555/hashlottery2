import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Constants

import { _global } from '../../../constants';

// Components

import { IconButton, Input } from '../../../components';

// Styles

import './styles.scss';

// ----------------

// Type of props

Search.propTypes = {
  networkProcess: types.object,
  withOutBorder: types.bool,
  submitHandler: types.func,
  className: types.string,
  style: types.object,
  ctx: types.object
};

// Default value for props

Search.defaultProps = {
  className: ''
};

const modify = props => classNames({});

// ----------------

export default function Search(props) {
  const { className, style, networkProcess, ctx, submitHandler, withOutBorder } = props;
  const { lan } = _global;

  const searchButton = (
    <IconButton
      status={networkProcess && networkProcess.status}
      onClick={submitHandler}
      mode="search"
    />
  );

  return (
    <div className={`search-form__input-wrapper ${modify(props)} ${className}`} style={style}>
      <Input
        {...lan.ui.input.search.base}
        customSideBlock={searchButton}
        withOutBorder={withOutBorder}
        fullWidth
        name="search"
        type="search"
        ctx={ctx}
      />
    </div>
  );
}
