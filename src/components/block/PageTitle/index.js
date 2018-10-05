import React from 'react';
import types from 'prop-types';

// Styles

import './styles.scss';

// ----------------

// Type of props

PageTitle.propTypes = {
  className: types.string,
  children: types.string,
  style: types.object
};

// Default value for props

PageTitle.defaultProps = {
  className: '',
  children: 'Page title'
};

// ----------------

export default function PageTitle(props) {
  const { className, style, children } = props;

  return (
    <h1 className={`page-title ${className}`} style={style}>
      {children}
    </h1>
  );
}
