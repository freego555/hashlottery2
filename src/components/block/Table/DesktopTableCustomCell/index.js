import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

// Styles

import './styles.scss';

// ----------------

// Type of props

DesktopTableCustomCell.propTypes = {
  className: types.string,
  style: types.object
};

// Default value for props

DesktopTableCustomCell.defaultProps = {
  className: ''
};

// Modify styles

const modify = props =>
  classNames({
    [`table-custom-cell--${props.justify}`]: props.justify,
    [`table-custom-cell--${props.color}`]: props.color,
    [`table-custom-cell--${props.align}`]: props.align,
    'table-custom-cell--uppercase': props.uppercase,
    'table-custom-cell--overflow': props.overflow,
    'table-custom-cell--bold': props.bold
  });

// ----------------

export default function DesktopTableCustomCell(props) {
  // Props for styling: uppercase, justify, overflow, bold, color, align,
  const { className, children, style, blank, link } = props;

  let _children =
    typeof children === 'object' ? (
      children
    ) : (
      <div className="desktop-table-card__text" title={children}>
        {children}
      </div>
    );

  if (link) {
    if (!blank) {
      _children = <Link to={link}>{_children}</Link>;
    } else {
      _children = (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {_children}
        </a>
      );
    }
  }

  return (
    <div className={`table-custom-cell ${modify(props)} ${className}`} style={style}>
      {_children}
    </div>
  );
}
