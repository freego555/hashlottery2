import React from 'react';
import query from 'querystringify';

// Constants

import { history } from '../../../constants';
import { _global } from '../../../constants';

// Components

import {
  SubTabsHeader,
  RoundButton,
  SubTabsBody,
  MessageFull,
  Container,
  PageTitle,
  Page,
  Tabs
} from '../../../components';

// Action creators

import { deleteMessage } from '../../../store/actionCreators/messages';

// Action types

import { DELETE_MESSAGE_NETWORK } from '../../../store/actionTypes/messages';

// Styles

import './styles.scss';

// Subroutes

const subRoutes = [require('./about-patients').default, require('./team-messages').default];

// ----------------

export default class MessagesPage extends Page {
  // Page (Route) config

  static title = _global.lan.pages.messagesPage.title;
  static path = '/main/messages/';

  state = {
    selectedMessage: null
  };

  // Bind methods

  pageContent = this.pageContent.bind(this);

  // -------- Methods --------

  // Content of route

  pageContent() {
    const messageId = query.parse(history.location.search).messageId;

    return (
      <React.Fragment>
        <div className={`messages-page`}>
          <PageTitle>{MessagesPage.title}</PageTitle>
          <div className="messages-page__content">
            <div className="messages-page__sidebar">
              <Tabs
                bodyClassName="messages-tabs__content"
                className="messages-tabs"
                body={SubTabsBody}
                header={SubTabsHeader}
                name="tab"
              >
                {subRoutes}
              </Tabs>
            </div>
            <React.Fragment>
              <Container
                mapState={state => ({
                  messages: state.messages.messages,
                  networkProcess: state.network[DELETE_MESSAGE_NETWORK]
                })}
                messageId={messageId}
                mapDispatch={{ deleteMessage: deleteMessage }}
              >
                {MessageFull}
              </Container>
            </React.Fragment>
          </div>
        </div>
        <div className="round-button-container">
          <RoundButton linkTo="/main/messages/new" />
        </div>
      </React.Fragment>
    );
  }

  // Render

  render() {
    return this.securRenderPage(this.pageContent);
  }
}
