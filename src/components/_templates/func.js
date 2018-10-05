import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Constants

// import {} from '../../constants';

// Components

// import {} from '../';

// Modules

// import {} from '../../modules';

// Styles

// import './styles.scss';

// ----------------

// Type of props

Name.propTypes = {
  className: types.string,
  style: types.object
};

// Default value for props

Name.defaultProps = {
  className: ''
};

// Modify styles

const modify = props => classNames({});

// ----------------

export default function Name(props) {
  const { className, style } = props;

  return <div className={`name ${modify(props)} ${className}`} style={style} />;
}
