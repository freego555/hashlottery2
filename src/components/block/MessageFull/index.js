import React from 'react';
import types from 'prop-types';
import ReactSVG from 'react-svg';
import moment from 'moment';
import classNames from 'classnames';

// Constants

import { _global } from '../../../constants';

// Components

import { IconButton, Loader } from '../../../components';

// Modules

import addQuery from '../../../modules/addQuery';

// Styles

import './styles.scss';

// Images

import fileIcon from '../../../static/img/icons/file.svg';

// ----------------

// Type of props

MessageFull.propTypes = {
  networkProcess: types.object,
  deleteMessage: types.func,
  className: types.string,
  style: types.object
};

// Default value for props

MessageFull.defaultProps = {
  className: ''
};

// Modify styles

const modify = props =>
  classNames({
    'messages-page__message-full--show': props.messageId
  });

// ----------------

export default function MessageFull(props) {
  const { lan } = _global;
  const { className, style, messageId, messages, deleteMessage, networkProcess } = props;
  const messageToShow = messages.find(item => item.id === +messageId);

  return !messageToShow ? (
    <div className={`messages-page__message-full`} style={style}>
      <div className="message-full message-full--placeholder">
        <h3>{lan.pages.messagesPage.fullMessageEmptyContent}</h3>
      </div>
    </div>
  ) : (
    <div className={`messages-page__message-full ${modify(props)} ${className}`} style={style}>
      <div className="message-full">
        <div className="message-full__header">
          <div className="message-full__heading">
            <h2 className="message-full__heading-title">{messageToShow.subject}</h2>
            <time className="message-full__heading-date">
              {moment(messageToShow.created).format('Do MMM YYYY, k:mm')}
            </time>
          </div>
          <div className="message-full__buttons">
            <div className="message-full__button-back">
              <IconButton
                onClick={() => {
                  addQuery(null, ['messageId'], false);
                }}
                mode="back"
              />
            </div>
            <div className="message-full__button-delete">
              {networkProcess && networkProcess.status === 'loading' ? (
                <Loader color="grey" />
              ) : (
                <IconButton
                  onClick={() => {
                    deleteMessage({ id: messageId });
                  }}
                  mode="delete"
                />
              )}
            </div>
          </div>
        </div>
        <div className="message-full-body">
          <div className="message-full-body__wrapper">
            <p className="message-full-body__from">
              {lan.pages.messagesPage.messageBody.from} {messageToShow.message_from}
            </p>
            <p className="message-full-body__to">
              {lan.pages.messagesPage.messageBody.to} {messageToShow.message_to}
            </p>
            <div className="message-full-body__content">{messageToShow.msg_content}</div>
            {messageToShow.files_detail.length ? (
              <div className="message-full-body__files">
                {messageToShow.files_detail.map(file => (
                  <a
                    key={file}
                    target="_blank"
                    download
                    href={file}
                    className="message-full-body__file"
                  >
                    <div className="message-full-body__file-icon">
                      <ReactSVG src={fileIcon} />
                    </div>
                    <div className="message-full-body__file-title">
                      {file.slice(file.lastIndexOf('/') + 1, file.indexOf('?'))}
                    </div>
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
