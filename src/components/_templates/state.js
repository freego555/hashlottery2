import React from 'react';
import types from 'prop-types';

// Constants

// import {} from '../../constants';

// Components

// import {} from '../';

// Modules

// import {} from '../../modules';

// Styles

// import './styles.scss';

// ----------------

export default class Name extends React.Component {
  // Type of props

  static propTypes = {
    className: types.string,
    style: types.object
  };

  // Default value for props

  static defaultProps = {
    className: ''
  };

  // State of component

  state = {};

  // Bind methods, that are going to be called as an event handlers

  // ...

  // -------- Methods --------

  // Render

  render() {
    const { className, style } = this.props;

    return <div className={`name ${className}`} style={style} />;
  }
}
