import React from 'react';
import types from 'prop-types';
import ReactSVG from 'react-svg';
import classNames from 'classnames';

// Constants

import { _global } from '../../../constants';

// Styles

import './styles.scss';

// Image and icons

import mobileDeleteMessage from '../../../static/img/icons/delete_message.svg';
import mobileRefreshIcon from '../../../static/img/icons/refresh_white.svg';
import mobileCancelIcon from '../../../static/img/icons/cancel_white.svg';
import mobileBackIcon from '../../../static/img/icons/arrow-left-solid.svg';
import deleteMessage from '../../../static/img/icons/delete_message.svg';
import mobileSearch from '../../../static/img/icons/search_icon.svg';
import refreshIcon from '../../../static/img/icons/refresh_blue.svg';
import cancelIcon from '../../../static/img/icons/cancel.svg';
import backIcon from '../../../static/img/icons/back.svg';
import search from '../../../static/img/icons/search_icon.svg';

// ----------------

// Type of props

IconButton.propTypes = {
  isBlockOpen: types.bool,
  titleFirst: types.bool,
  className: types.string,
  onClick: types.func,
  style: types.object,
  mode: types.string
};

// Default value for props

IconButton.defaultProps = {
  className: ''
};

// Modify styles

const modify = props =>
  classNames({
    [`icon-btn--${props.mode}`]: props.mode,
    'icon-btn--title-first': props.titleFirst
  });

const iconStyle = props =>
  classNames({
    [`icon-btn__icon-wrapper--${props.mode}`]: props.mode,
    [`icon-btn__mobile-icon-wrapper--${props.mode}`]: props.mode
  });

// ----------------

export default function IconButton(props) {
  const { className, style, onClick, mode, withTitle, mobileMode } = props;
  const { lan } = _global;

  // Dummy data
  const buttonIcons = {
    back: {
      tablet: backIcon,
      mobile: mobileBackIcon,
      title: lan.ui.button.back
    },
    refresh: {
      tablet: refreshIcon,
      mobile: mobileRefreshIcon,
      title: lan.ui.button.refresh
    },
    cancel: {
      tablet: cancelIcon,
      mobile: mobileCancelIcon,
      title: lan.ui.button.cancel
    },
    delete: {
      tablet: deleteMessage,
      mobile: mobileDeleteMessage,
      title: lan.ui.button.delete
    },
    search: {
      tablet: search,
      mobile: mobileSearch,
      title: lan.ui.button.search
    }
  };

  return (
    <button className={`icon-btn ${modify(props)} ${className}`} onClick={onClick} style={style}>
      <div className={`icon-btn__mobile-icon-wrapper ${iconStyle(props)}`}>
        <ReactSVG src={buttonIcons[mode].mobile} />
      </div>
      <div className={`icon-btn__icon-wrapper ${iconStyle(props)}`}>
        {mobileMode ? (
          <ReactSVG src={buttonIcons[mode].mobile} />
        ) : (
          <ReactSVG src={buttonIcons[mode].tablet} />
        )}
      </div>
      {withTitle && <p className="icon-btn__title">{buttonIcons[mode].title}</p>}
    </button>
  );
}
