import React from 'react';
import types from 'prop-types';

// Styles

import './styles.scss';

// ----------------

// Type of props

AlertCard.propTypes = {
  className: types.string,
  style: types.object,
  data: types.object
};

// Default value for props

AlertCard.defaultProps = {
  className: ''
};

// ----------------

export default function AlertCard(props) {
  const { className, style, data } = props;

  return (
    <div className={`alert-card ${className}`} style={style}>
      <p className="alert-card__main-title">{data.alert_title}</p>
      {data.quantity_of_alert && (
        <p className="alert-card__alert-counter">
          {data.quantity_of_alert > 99 ? '99+' : data.quantity_of_alert}
        </p>
      )}
      <div className="alert-card__alert-names-wrapper">
        <span className="alert-card__alert-name">{data.first_monitoring_title}</span>
        <span className="alert-card__alert-name">{data.second_monitoring_title}</span>
      </div>
    </div>
  );
}
