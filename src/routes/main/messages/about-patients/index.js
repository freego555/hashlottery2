import React from 'react';
import query from 'querystringify';

// Constants

import { history, _global } from '../../../../constants';

// Components

import { Page, Container, List, SearchForm, MessagePreview } from '../../../../components';

// Action creators

import {
  deleteMessagesFromLocalState,
  searchPatientMessages,
  fetchPatientMessages,
  readMessage
} from '../../../../store/actionCreators/messages';

// Action types

import { SEARCH_PATIENT_MESSAGES_NETWORK } from '../../../../store/actionTypes/messages';

// ----------------

export default class TeamMessagesTab extends Page {
  // Route config

  static permission = 'permission';
  static title = 'About Patients';
  static asTab = {
    displayName: 'About Patients',
    queryName: 'about-patients'
  };

  // Bind methods

  pageContent = this.pageContent.bind(this);

  // -------- Methods --------

  //mount = [{ ac: fetchPatientMessages }];

  unmount = [deleteMessagesFromLocalState];

  // Placeholder for <List /> component

  noMessagesTemplate = () => <div>{_global.lan.pages.messagesPage.listEmptyContent}</div>;

  // Content of route

  pageContent() {
    const messageId = query.parse(history.location.search).messageId;

    return (
      <React.Fragment>
        <div className="messages-page__sidebar-header">
          <div className="messages-page__search">
            <Container
              mapDispatch={{
                beforeClearInputCallBack: deleteMessagesFromLocalState,
                onClearInputCallBack: fetchPatientMessages,
                submitAction: searchPatientMessages
              }}
            >
              {SearchForm}
            </Container>
          </div>
        </div>
        <div className="messages-list__wrapper">
          <div className="messages-list">
            <Container
              mapState={state => ({
                networkProcess: state.network[SEARCH_PATIENT_MESSAGES_NETWORK],
                userId: state.user.data.pk,
                list: state.messages.messages
              })}
              messageId={+messageId}
              mapDispatch={{ readMessage }}
              childProps={{
                listItem: MessagePreview,
                empty: this.noMessagesTemplate
              }}
            >
              {List}
            </Container>
          </div>
        </div>
      </React.Fragment>
    );
  }

  // Render

  render() {
    return this.securRenderPage(this.pageContent);
  }
}
