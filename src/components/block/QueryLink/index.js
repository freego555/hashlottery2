import React from 'react';
import types from 'prop-types';
import { Link } from 'react-router-dom';

// Constants

import { history } from '../../../constants';

// Modules

import addQuery from '../../../modules/addQuery';

// ----------------

// Type of props

QueryLink.propTypes = {
  deleteQuery: types.array,
  className: types.string,
  children: types.oneOfType([types.string, types.object]),
  style: types.object,
  query: types.object.isRequired
};

// Default value for props

QueryLink.defaultProps = {
  activeClassName: '',
  className: '',
  children: 'Query Link'
};

// ----------------

export default function QueryLink(props) {
  const { className, style, children, query, deleteQuery } = props;

  return (
    <Link
      className={className}
      style={style}
      to={`${history.location.pathname}${addQuery(query, deleteQuery, true)}`}
    >
      {children}
    </Link>
  );
}
