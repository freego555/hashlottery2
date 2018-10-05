import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import addQuery from '../../../modules/addQuery';

// Constants

import { _global } from '../../../constants';

// Styles

import './styles.scss';

// ----------------

// Type of props

MessagePreview.propTypes = {
  className: types.string,
  messageId: types.number,
  userId: types.string,
  onClick: types.func,
  style: types.object,
  data: types.object
};

// Default value for props

MessagePreview.defaultProps = {
  className: ''
};

// Modify styles

const modify = unread =>
  classNames({
    'message-preview--unreaded': unread
  });

const modifyActiveClass = active =>
  classNames({
    'message-preview--active': active
  });

const readMessageHandler = (id, unread, ac) => {
  addQuery({ messageId: id }, null, false);
  if (unread) ac({ id });
};

// ----------------

export default function MessagePreview(props) {
  const { lan } = _global;
  const { className, style, data, readMessage, userId, messageId } = props;
  const { msg_content, subject, message_from, id, created, read_by } = data;
  const unread = !read_by.includes(userId);
  return (
    <div
      className={`message-preview ${modify(unread)} ${modifyActiveClass(
        messageId === id
      )} ${className}`}
      style={style}
      onClick={() => readMessageHandler(id, unread, readMessage)}
    >
      <div className="message-preview__header">
        <h5 className="message-preview__from">
          {lan.pages.messagesPage.messageBody.from} {message_from}
        </h5>
      </div>
      <div className="message-preview__content">
        <h6 className="message-preview__title">{subject}</h6>
        <p className="message-preview__description">{msg_content}</p>
        <time className="message-preview__date">{moment(created).format('Do MMM YYYY, k:mm')}</time>
      </div>
    </div>
  );
}
