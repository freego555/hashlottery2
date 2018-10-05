import React from 'react';
import types from 'prop-types';
import Select, { components } from 'react-select';
import ReactSVG from 'react-svg';
import classNames from 'classnames';

// Constants

import { _global } from '../../../constants';

// Components

import { FieldWrapper, Loader } from '../../../components';

// Style

import './styles.scss';

// Images

import add from '../../../static/img/icons/add.svg';

// ----------------

// Type of props

MultiSelect.propTypes = {
  placeholder: types.oneOfType([types.string, types.func]),
  classNamePrefix: types.string,
  customSideBlock: types.object,
  name: types.string.isRequired,
  ctx: types.object.isRequired,
  isNetworkProcess: types.bool,
  isSearchable: types.bool,
  className: types.string,
  isDisabled: types.bool,
  onChange: types.func,
  style: types.object,
  title: types.string,
  value: types.array,
  error: types.string
};

// Default value for props

MultiSelect.defaultProps = {
  className: ''
};

// Modify styles

const modify = error =>
  classNames({
    'multi-select--error': error
  });

const modifyFieldWrapper = props =>
  classNames({
    'ui-field-wrapper__block--full-width': props.fullWidth
  });

// Custom element for react-select

const noOptionMessage = () => _global.lan.ui.multiselect.noMatchesMessage;

const loadingPlaceholder = () => <Loader color="grey" />;

const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <div className="multi-select__dropdown-button">
          <ReactSVG src={add} />
        </div>
      </components.DropdownIndicator>
    )
  );
};

// ----------------

export default function MultiSelect(props) {
  const {
    isNetworkProcess,
    classNamePrefix,
    isSearchable,
    placeholder,
    isDisabled,
    className,
    onChange,
    options,
    isMulti,
    title,
    error,
    value,
    name,
    ctx
  } = props;

  return (
    <FieldWrapper
      className={`${modifyFieldWrapper(props)} ${className}`}
      error={error || ctx.state.status[name]}
      title={title}
    >
      <div className="simple-input__wrapper">
        <Select
          className={`${className} ${modify(error || ctx.state.status[name])}`}
          onFocus={() => ctx.focusHandler({ target: { name: name } })}
          onBlur={() => ctx.blurHandler({ target: { name: name } })}
          components={{ DropdownIndicator }}
          noOptionsMessage={noOptionMessage}
          classNamePrefix={classNamePrefix}
          isSearchable={isSearchable}
          placeholder={isNetworkProcess ? loadingPlaceholder() : placeholder}
          isDisabled={isDisabled}
          onChange={onChange}
          isMulti={isMulti}
          options={options}
          value={value}
          name={name}
        />
      </div>
    </FieldWrapper>
  );
}
