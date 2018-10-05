import React from 'react';

// Components

import { Page, LoginForm, Container } from '../../../components';

// Action creators

import { loginUser } from '../../../store/actionCreators/user';

// Action types

import { LOGIN_NETWORK } from '../../../store/actionTypes/user';

// ----------------

export default class LoginPage extends Page {
  // Page (Route) config

  static title = 'Login';
  static path = '/auth/login';

  // -------- Methods --------

  // Render

  render() {
    return (
      <Container
        mapState={state => ({ networkProcess: state.network[LOGIN_NETWORK] })}
        mapDispatch={{ submitAction: loginUser }}
      >
        {LoginForm}
      </Container>
    );
  }
}
