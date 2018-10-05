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

import letterIcon from '../../../../static/img/icons/letter.svg';

// ----------------

export default class ResetPasswordForm extends Form {
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
        email: ''
      },
      isEmailSend: false
    };

    // Validation rules

    this.rules = {
      email: { ...rules.email, message: _global.lan.ui.input.email.message }
    };

    // Bind methods, that are going to be called as an event handlers

    this.successCallBack = this.successCallBack.bind(this);

    // Init form

    this.init();
  }

  // -------- Methods --------

  // Callback on a successful network request

  successCallBack() {
    this.setState({ isEmailSend: true });
  }

  // Render

  render() {
    const { className, style, networkProcess } = this.props;
    const { isEmailSend } = this.state;
    const { lan } = _global;

    return (
      <div className={`reset-password-form ${className}`} style={style}>
        <div className="reset-password-form__upper-block">
          {isEmailSend ? (
            <React.Fragment>
              <div className="reset-password-form__logo-wrapper">
                <ReactSVG src={letterIcon} />
              </div>
              <p className="reset-password-form__title">{lan.forms.resetPasswordForm.title}</p>
              <p className="reset-password-form__subtitle">
                {lan.forms.resetPasswordForm.subtitle}
              </p>
              <Button status={networkProcess && networkProcess.status} onClick={this.submitHandler}>
                {lan.ui.button.resendLink}
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p className="reset-password-form__description">
                {lan.forms.resetPasswordForm.description}
              </p>
              <Input {...lan.ui.input.email.base} name="email" ctx={this} />
              <Button status={networkProcess && networkProcess.status} onClick={this.submitHandler}>
                {lan.ui.button.sendLink}
              </Button>
            </React.Fragment>
          )}
        </div>
        <div className="reset-password-form__back-btn">
          <Link to="/auth/login">
            <Button style={{ maxWidth: '250px' }} color="white">
              {lan.ui.button.backLogin}
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
