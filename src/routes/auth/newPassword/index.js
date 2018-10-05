import React from 'react';
import query from 'querystringify';

// Constants

import { history } from '../../../constants';

// Components

import { Page, NewPasswordForm, Container } from '../../../components';

// Action creators

import { newPassword } from '../../../store/actionCreators/user';

// Action types

import { CREATE_NEW_PASSWORD_NETWORK } from '../../../store/actionTypes/user';

// ----------------

export default class NewPasswordPage extends Page {
  // Route (Page) config

  static queryForAccess = ['uid', 'token'];
  static title = 'New password';
  static path = '/auth/new-password';

  // Bind methods

  pageContent = this.pageContent.bind(this);

  // -------- Methods --------

  // Content of page (Route)

  pageContent() {
    const queryObject = query.parse(history.location.search);

    return (
      <Container
        mapState={state => ({ networkProcess: state.network[CREATE_NEW_PASSWORD_NETWORK] })}
        mapDispatch={{ submitAction: newPassword }}
        childProps={{ uid: queryObject.uid, token: queryObject.token }}
      >
        {NewPasswordForm}
      </Container>
    );
  }

  // Render

  render() {
    return this.securRenderPage(this.pageContent);
  }
}
