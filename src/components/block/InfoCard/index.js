import React from 'react';
import types from 'prop-types';

// Styles

import './styles.scss';

// ----------------

// Type of props

InfoCard.propTypes = {
  className: types.string,
  style: types.object,
  label: types.string,
  value: types.any
};

// Default value for props

InfoCard.defaultProps = {
  className: ''
};

// ----------------

export default function InfoCard(props) {
  const { className, style, label, value } = props;

  return (
    <div className={`info-card ${className}`} style={style}>
      <span className="info-card__label">{label}</span>
      <span className="info-card__value">{value}</span>
    </div>
  );
}
