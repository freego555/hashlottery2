import React from 'react';
import types from 'prop-types';
import ReactSVG from 'react-svg';
import { Link } from 'react-router-dom';

// Constants

import { _global } from '../../../../constants';
import rules from '../../../../constants/validation';

// Components

import { Input, Button } from '../../../';
import Form from '../../../core/Form';

// Styles

import './styles.scss';

// Image and icons

import checkIcon from '../../../../static/img/icons/check.svg';

// ----------------

export default class NewPasswordForm extends Form {
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

    // State of component

    this.state = {
      form: {
        new_password1: '',
        new_password2: '',
        token: props.token,
        uid: props.uid
      },
      isChangesSaved: false
    };

    // Validation rules

    this.rules = {
      new_password1: { ...rules.password, message: _global.lan.ui.input.password.message },
      new_password2: { confirm: 'new_password1' }
    };

    // Bind methods, that are going to be called as an event handlers

    this.successCallBack = this.successCallBack.bind(this);

    // Init form

    this.init();
  }

  // -------- Methods --------

  // Callback on a successful network request. Optional

  successCallBack() {
    this.setState({ isChangesSaved: true });
  }

  // Render

  render() {
    const { className, style, networkProcess } = this.props;
    const { isChangesSaved } = this.state;
    const { lan } = _global;

    return (
      <div className={`new-password-form ${className}`} style={style}>
        <div className="new-password-form__upper-block">
          {isChangesSaved ? (
            <React.Fragment>
              <div className="new-password-form__logo-wrapper">
                <ReactSVG src={checkIcon} />
              </div>
              <p className="new-password-form__title">{lan.forms.newPasswordForm.title}</p>
              <p className="new-password-form__subtitle">{lan.forms.newPasswordForm.subtitle}</p>
              <div className="new-password-form__login-btn">
                <Link to="/auth/login">
                  <Button>{lan.ui.button.login}</Button>
                </Link>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p className="new-password-form__description">
                {lan.forms.newPasswordForm.description}
              </p>
              <Input
                {...lan.ui.input.password.base}
                name="new_password1"
                type="password"
                ctx={this}
              />
              <Input
                {...lan.ui.input.confirmPassword.base}
                name="new_password2"
                type="password"
                ctx={this}
              />
              <Button status={networkProcess && networkProcess.status} onClick={this.submitHandler}>
                {lan.ui.button.newPassword}
              </Button>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}
