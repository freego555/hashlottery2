import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Constants

import { history } from '../../../../constants';

// Styles

import './styles.scss';

// ----------------

// Type of props

DesktopTableCard.propTypes = {
  className: types.string,
  style: types.object
};

// Default value for props

DesktopTableCard.defaultProps = {
  className: ''
};

// Modify styles

const modify = props => classNames({});

// ----------------

export default function DesktopTableCard(props) {
  const { columnWidth, className, children, style, data } = props;
  const _children = Array.isArray(children) ? children : [children];

  return (
    <div
      className={`desktop-table-card ${modify(props)} ${className}`}
      onClick={() => history.push(`/main/patients/${data.patient_id}`)}
      style={style}
    >
      {_children.map((column, i) => (
        <div
          className="desktop-table-card__column-cell"
          style={{ width: `${columnWidth[i]}%`, minWidth: `${columnWidth[i]}%` }}
          key={i}
        >
          {typeof column === 'object' ? (
            column
          ) : (
            <div className="desktop-table-card__text" title={column}>
              {column}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
