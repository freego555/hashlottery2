import React from 'react';
import types from 'prop-types';

// Styles

import './styles.scss';

// ----------------

// Type of props

FieldWrapper.propTypes = {
  className: types.string,
  children: types.object,
  style: types.object,
  title: types.string,
  error: types.string
};

// Default value for props

FieldWrapper.defaultProps = { className: '' };

// ----------------

export default function FieldWrapper(props) {
  const { className, style, children, title, error } = props;

  return (
    <div className={`ui-field-wrapper__block ${className}`} style={style}>
      {title && <p className="ui-field-wrapper__title">{title}</p>}
      {children}
      {error && <p className="ui-field-wrapper__error">{error}</p>}
    </div>
  );
}
