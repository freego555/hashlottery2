import React from 'react';
import types from 'prop-types';
import { Link } from 'react-router-dom';

// Constants

import { _global } from '../../../../constants';
import rules from '../../../../constants/validation';

// Components

import { Button, Input, Visible } from '../../../../components';
import Form from '../../../core/Form';

// Styles

import './styles.scss';

// ----------------

export default class LoginForm extends Form {
  // Type of props

  static propTypes = { className: types.string, style: types.object };

  // Default value for props

  static defaultProps = { className: '' };

  constructor(props) {
    super(props);

    // State of component

    this.state = {
      form: {
        password: '',
        email: ''
      },
      passwordType: 'password'
    };

    // Validation rules

    this.rules = {
      password: { ...rules.password, message: _global.lan.ui.input.password.message },
      email: { ...rules.email, message: _global.lan.ui.input.email.message }
    };

    // Bind

    this.changePasswordType = this.changePasswordType.bind(this);

    // Init form

    this.init();
  }

  // -------- Methods --------

  // Change password field type

  changePasswordType() {
    const { passwordType } = this.state;

    if (passwordType === 'password') {
      this.setState({ passwordType: 'text' });
    } else {
      this.setState({ passwordType: 'password' });
    }
  }

  // Render

  render() {
    const { className, style, networkProcess } = this.props;
    const { status, passwordType } = this.state;
    const { lan } = _global;

    return (
      <div className={`login-form ${className}`} style={style}>
        <div className="login-form__upper-block">
          {status.non_field_errors && (
            <p className="login-form__error">{lan.forms.loginForm.error}</p>
          )}
          <Input {...lan.ui.input.email.base} name="email" ctx={this} />
          <Input
            {...lan.ui.input.password.base}
            customSideBlock={
              <Visible onClick={this.changePasswordType} visible={passwordType !== 'text'} />
            }
            type={passwordType}
            name="password"
            ctx={this}
          />
          <Button status={networkProcess && networkProcess.status} onClick={this.submitHandler}>
            {lan.ui.button.login}
          </Button>
        </div>
        <div className="login-form__reset-btn">
          <Link to="/auth/reset-password">
            <Button style={{ maxWidth: '250px' }} color="white">
              {lan.ui.button.resetPassword}
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
