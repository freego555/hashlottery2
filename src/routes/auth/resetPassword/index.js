import React from 'react';

// Components

import { Page, ResetPasswordForm, Container } from '../../../components';

// Action creators

import { resetPassword } from '../../../store/actionCreators/user';

// Action types

import { RESET_PASSWORD_NETWORK } from '../../../store/actionTypes/user';

// ----------------

export default class ResetPasswordPage extends Page {
  // Route (Page) config

  static title = 'Reset password';
  static path = '/auth/reset-password';

  // -------- Methods --------

  // Render

  render() {
    return (
      <Container
        mapState={state => ({ networkProcess: state.network[RESET_PASSWORD_NETWORK] })}
        mapDispatch={{ submitAction: resetPassword }}
      >
        {ResetPasswordForm}
      </Container>
    );
  }
}
