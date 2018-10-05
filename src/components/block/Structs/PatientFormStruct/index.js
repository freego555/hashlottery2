import React from 'react';
import types from 'prop-types';

// Constants

import { _global } from '../../../../constants';

// Components

import { Button } from '../../../../components';

// Styles

import './styles.scss';

// ----------------

// Type of props

PatientFormStruct.propTypes = {
  proceedHandler: types.func,
  proceedAsSave: types.bool,
  backHandler: types.func,
  skipHandler: types.func,
  className: types.string,
  children: types.oneOfType([types.array, types.object]),
  style: types.object
};

// Default value for props

PatientFormStruct.defaultProps = {
  className: ''
};

// ----------------

export default function PatientFormStruct(props) {
  const {
    proceedHandler,
    proceedAsSave,
    backHandler,
    skipHandler,
    className,
    children,
    style
  } = props;
  const { lan } = _global;

  return (
    <div className={`patient-form-struct ${className}`} style={style}>
      {Array.isArray(children) ? (
        children.map((item, index) => (
          <div key={index} className="patient-form-struct__block">
            {item.props.children}
          </div>
        ))
      ) : (
        <div className="patient-form-struct__block">{children.props.children}</div>
      )}
      <div className="patient-form-struct__buttons-block">
        {backHandler && (
          <Button onClick={backHandler} status color="white">
            {lan.ui.button.back}
          </Button>
        )}
        <div className="patient-form-struct__buttons-group">
          {skipHandler && (
            <Button onClick={skipHandler} status color="transparent">
              {proceedAsSave ? lan.ui.button.skipAndSave : lan.ui.button.skip}
            </Button>
          )}
          <Button status onClick={proceedHandler}>
            {proceedAsSave ? lan.ui.button.save : lan.ui.button.proceed}
          </Button>
        </div>
      </div>
    </div>
  );
}
