import React from 'react';
import types from 'prop-types';

// Component

import Loader from '../Loader';

// Modules

import deleteProps from '../../../modules/deleteProps';

// Styles

import './styles.scss';

// ----------------

// Type of props

List.propTypes = {
  networkProcess: types.object,
  className: types.string,
  listItem: types.func.isRequired,
  keyName: types.string,
  height: types.string,
  style: types.object,
  empty: types.func,
  list: types.array.isRequired
};

// Default value for props

List.defaultProps = {
  className: '',
  height: '200px',
  empty: () => <div>Empty</div>
};

// ----------------

export default function List(props) {
  const {
    networkProcess,
    className,
    listItem: ListItem,
    keyName,
    height,
    empty: Empty,
    style,
    list
  } = props;

  return (
    <div className={`list ${className}`} style={style}>
      {networkProcess && networkProcess.status === 'loading' ? (
        <div className="list__icon-wrapper" style={{ minHeight: height }}>
          <Loader />
        </div>
      ) : list.length ? (
        list.map((item, index) => (
          <ListItem
            data={item}
            key={item[keyName || 'id'] || index}
            {...deleteProps(props, [
              'networkProcess',
              'className',
              'listItem',
              'keyName',
              'height',
              'style',
              'empty',
              'list'
            ])}
          />
        ))
      ) : (
        <div className="list__icon-wrapper" style={{ minHeight: height }}>
          <Empty />
        </div>
      )}
    </div>
  );
}
