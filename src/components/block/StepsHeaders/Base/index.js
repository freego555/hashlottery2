import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Styles

import './styles.scss';

// ----------------

// Type of props

BaseStepsHeader.propTypes = {
  activeStepIndex: types.number,
  className: types.string,
  style: types.object,
  steps: types.array.isRequired
};

// Default value for props

BaseStepsHeader.defaultProps = {
  activeTabIndex: 0,
  className: '',
  tabs: []
};

// Modify styles

const activeStepStyle = (activeStepIndex, index) =>
  classNames({
    'base-steps-header__step--active': index <= activeStepIndex
  });

// ----------------

export default function BaseStepsHeader(props) {
  const { className, style, steps, activeStepIndex } = props;

  return (
    <div className={`base-steps-header ${className}`} style={style}>
      <div className="base-steps-header__step-list">
        {steps.map((step, index) => (
          <div
            className={`base-steps-header__step ${activeStepStyle(activeStepIndex, index)}`}
            key={step.key}
          >
            <p className="base-steps-header__step-title">{step.displayName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
