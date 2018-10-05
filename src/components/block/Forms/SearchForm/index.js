import React from 'react';
import types from 'prop-types';

// Components

import { Search } from '../../../../components';
import Form from '../../../core/Form';

// Styles

import './styles.scss';

// ----------------

export default class SearchForm extends Form {
  // Type of props

  static propTypes = {
    beforeClearInputCallBack: types.func,
    onClearInputCallBack: types.func,
    isCallBackEnabled: types.bool,
    networkProcess: types.object,
    withOutBorder: types.bool,
    className: types.string,
    style: types.object
  };

  // Default value for props

  static defaultProps = {
    className: ''
  };

  constructor(props) {
    super(props);

    // State of component

    this.state = {
      form: {
        search: ''
      }
    };

    // Init form

    this.init();
  }

  // -------- Methods --------

  changeHandler(e) {
    const { target } = e;

    this.setState(prevState => ({
      form: {
        ...prevState.form,
        [target.name]: target.value
      }
    }));
    if (this.props.isCallBackEnabled && !target.value) this.onClearInputCallBack();
  }

  onClearInputCallBack = () => {
    const { beforeClearInputCallBack, onClearInputCallBack } = this.props;
    if (beforeClearInputCallBack) beforeClearInputCallBack();
    if (onClearInputCallBack) onClearInputCallBack();
  };

  // Render

  render() {
    const { className, style, networkProcess, withOutBorder } = this.props;

    return (
      <div className={`search-form ${className}`} style={style}>
        <Search
          networkProcess={networkProcess}
          submitHandler={this.submitHandler}
          withOutBorder={withOutBorder}
          ctx={this}
        />
      </div>
    );
  }
}
