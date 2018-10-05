import React from 'react';
import types from 'prop-types';
import ReactSVG from 'react-svg';
import classNames from 'classnames';
import SmoothCollapse from 'react-smooth-collapse';

// Styles

import './styles.scss';

// Image and icons

import collapseIcon from '../../../static/img/icons/chevron_right.svg';

// ----------------

// Modify styles

const modifyCollapseIcon = expanded =>
  classNames({
    'pacient-info-block__collapse-icon--open': expanded
  });

// ----------------

export default class PacientSideInfoBlock extends React.Component {
  // Type of props

  static propTypes = {
    headerTitle: types.string,
    headerIcon: types.string,
    className: types.string,
    children: types.any,
    style: types.object
  };

  // Default value for props

  static defaultProps = {
    className: ''
  };

  // State of component

  state = { expanded: false };

  // Bind methods, that are going to be called as an event handlers

  // ...

  // -------- Methods --------

  toggleExpandedBlock = () => {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  };

  // Render

  render() {
    const { className, style, headerIcon, headerTitle, alertCounter, children } = this.props;
    const { expanded } = this.state;

    return (
      <div className={`pacient-info-block ${className}`} style={style}>
        <div className="pacient-info-block__header" onClick={() => this.toggleExpandedBlock()}>
          <div className="pacient-info-block__header-icon">
            <ReactSVG src={headerIcon} />
          </div>
          <p className="pacient-info-block__header-title">{headerTitle}</p>
          {alertCounter &&
            !expanded && (
              <p className="pacient-info-block__header-counter">
                {alertCounter > 99 ? '99+' : alertCounter}
              </p>
            )}
          <div className={`pacient-info-block__collapse-icon ${modifyCollapseIcon(expanded)}`}>
            <ReactSVG src={collapseIcon} />
          </div>
        </div>
        <SmoothCollapse expanded={expanded} className="pacient-info-block__collapse-wrapper">
          <div className="pacient-info-block__content">{children}</div>
        </SmoothCollapse>
      </div>
    );
  }
}
