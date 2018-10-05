import React from 'react';

// Components

import { Page, NewMessageForm, Container, PageTitle } from '../../../components';

// Action creators

import { sendMessage } from '../../../store/actionCreators/messages';
import { fetchUsers } from '../../../store/actionCreators/users';

// Action types

import { SEND_MESSAGE_NETWORK } from '../../../store/actionTypes/messages';
import { FETCH_ALL_USERS_NETWORK } from '../../../store/actionTypes/users';

// Styles

import './styles.scss';

// ----------------

export default class MessagesPage extends Page {
  // Page (Route) config

  static title = 'Create New Team Message';
  static path = '/main/messages/new';

  // -------- Methods --------

  mount = [{ ac: fetchUsers }];

  // Render

  render() {
    return (
      <div className={`new-message-page`}>
        <PageTitle>{MessagesPage.title}</PageTitle>
        <div className="new-message-page__content">
          <Container
            mapState={state => ({
              users: state.users.users,
              networkProcess: state.network[SEND_MESSAGE_NETWORK],
              fetchingUsersProcess: state.network[FETCH_ALL_USERS_NETWORK]
            })}
            mapDispatch={{ submitAction: sendMessage }}
            childProps={{ pageTitle: MessagesPage.title }}
          >
            {NewMessageForm}
          </Container>
        </div>
      </div>
    );
  }
}
