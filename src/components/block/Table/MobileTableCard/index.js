import React from 'react';
import types from 'prop-types';
import ReactSVG from 'react-svg';
import classNames from 'classnames';
import SmoothCollapse from 'react-smooth-collapse';

// Constants

import { history } from '../../../../constants';

// Components

import { Button } from '../../../../components';

// Styles

import './styles.scss';

// Image and icons

import collapseIcon from '../../../../static/img/icons/chevron_right.svg';

// ----------------

// Modify styles

const modifyCollapseIcon = expanded =>
  classNames({
    'mobile-table-card__collapse-icon--open': expanded
  });

const headerBorderStyle = expanded =>
  classNames({
    'mobile-table-card__header--open': expanded
  });

// ----------------

export default class MobileTableCard extends React.Component {
  // Type of props

  static propTypes = {
    headerTitle: types.string,
    headerIcon: types.string,
    className: types.string,
    children: types.object.isRequired,
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
    const { className, children, style, data } = this.props;
    const { expanded } = this.state;
    const _children = Array.isArray(children) ? children : [children];

    return (
      <div className={`mobile-table-card ${className}`} style={style}>
        <div
          className={`mobile-table-card__header ${headerBorderStyle(expanded)}`}
          onClick={() => this.toggleExpandedBlock()}
        >
          <p className="mobile-table-card__header-title">{data.full_name}</p>
          <ReactSVG
            src={collapseIcon}
            className={`mobile-table-card__collapse-icon ${modifyCollapseIcon(expanded)}`}
          />
        </div>
        <SmoothCollapse expanded={expanded} className="mobile-table-card__collapse-wrapper">
          <div className="mobile-table-card__content">
            {_children.map((row, i) => (
              <div className="mobile-table-card__row-cell" key={i}>
                <span className="mobile-table-card__row-label">{row.label}</span>
                <span className="mobile-table-card__row-value">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="mobile-table-card__footer">
            <Button
              onClick={() => history.push(`/main/patients/${data.patient_id}`)}
              status
              style={{ maxWidth: '160px', height: '40px', margin: '0' }}
            >
              View Profile
            </Button>
          </div>
        </SmoothCollapse>
      </div>
    );
  }
}
