import React from 'react';
import query from 'querystringify';

// Constants

import { history, _global } from '../../../../constants';

// Components

import {
  Page,
  Container,
  List,
  SearchForm,
  MessagePreview,
  LoadMoreButton
} from '../../../../components';

// Action creators

import {
  fetchTeamMessages,
  readMessage,
  deleteMessagesFromLocalState,
  searchTeamMessages
} from '../../../../store/actionCreators/messages';

// Action types

import {
  FETCH_TEAM_MESSAGES_NETWORK,
  SEARCH_TEAM_MESSAGES_NETWORK
} from '../../../../store/actionTypes/messages';

// ----------------

export default class TeamMessagesTab extends Page {
  // Route config

  static permission = 'permission';
  static title = 'Team Messages';
  static asTab = { displayName: 'Team Messages', queryName: 'team-messages' };

  // Bind methods

  pageContent = this.pageContent.bind(this);

  // -------- Methods --------

  mount = [{ ac: fetchTeamMessages }];

  unmount = [deleteMessagesFromLocalState];

  // Placeholder for <List /> component

  noMessagesTemplate = () => <div>{_global.lan.pages.messagesPage.listEmptyContent}</div>;

  // Content of route

  pageContent() {
    const { lan } = _global;
    const messageId = query.parse(history.location.search).messageId;

    return (
      <React.Fragment>
        <div className="messages-page__sidebar-header">
          <div className="messages-page__search">
            <Container
              mapDispatch={{
                beforeClearInputCallBack: deleteMessagesFromLocalState,
                onClearInputCallBack: fetchTeamMessages,
                submitAction: searchTeamMessages
              }}
              childProps={{ isCallBackEnabled: true }}
            >
              {SearchForm}
            </Container>
          </div>
        </div>
        <div className="messages-list__wrapper">
          <div className="messages-list">
            <Container
              mapState={state => ({
                networkProcess: state.network[SEARCH_TEAM_MESSAGES_NETWORK],
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
            <Container
              mapState={state => ({
                networkProcess:
                  state.network[FETCH_TEAM_MESSAGES_NETWORK] ||
                  state.network[SEARCH_TEAM_MESSAGES_NETWORK],
                next: state.messages.next
              })}
              mapDispatch={{ onClick: fetchTeamMessages }}
              childProps={{ children: lan.ui.button.showMore }}
            >
              {LoadMoreButton}
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
