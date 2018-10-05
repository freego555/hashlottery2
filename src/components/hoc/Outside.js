import React from 'react';
import types from 'prop-types';
import onClickOutside from 'react-onclickoutside';

// ----------------

class Outside extends React.Component {
  // Type of props

  static propTypes = {
    children: types.object,
    onOutsideClick: types.func
  };

  // State of component

  state = {};

  // Bind methods, that are going to be called as an event handlers

  // -------- Methods --------

  outsideClickHandler() {
    this.props.onOutsideClick();
  }

  // Render

  render() {
    const { children } = this.props;
    return children;
  }
}

const config = {
  handleClickOutside: instance => instance.outsideClickHandler
};

export default onClickOutside(Outside, config);
