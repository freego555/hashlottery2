import React from 'react';
import types from 'prop-types';

// Constants

import { _global } from '../../../../constants';
import rules from '../../../../constants/validation';

// Components

// import {} from '../../../';
import Form from '../../../core/Form';

// Modules

// import {} from '../../../../modules';

// Styles

// import './styles.scss';

// ----------------

export default class NameForm extends Form {
  // Type of props

  static propTypes = {
    className: types.string,
    style: types.object
  };

  // Default value for props

  static defaultProps = {
    className: ''
  };

  constructor(props) {
    super(props);

    this.submitAction = () => alert('Sending form...');

    // State of component

    this.state = {
      form: {}
    };

    // Validation rules

    this.rules = {};

    // Bind methods, that are going to be called as an event handlers

    // ...

    // Init form

    this.init();
  }

  // -------- Methods --------

  // Callback on a successful network request. Optional

  successCallBack() {}

  // Transform form for send. Optional

  transformForm() {}

  // Render

  render() {
    const { className, style } = this.props;
    const { lan } = _global;

    return <div className={`name ${className}`} style={style} />;
  }
}
