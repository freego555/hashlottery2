import React from 'react';
import types from 'prop-types';

// Constants

import { _global } from '../../../../constants';

// Components

import { PatientFormStruct, DatePicker, Select, Switch, Input } from '../../../../components';

// Core

import Form from '../../../core/Form';

// Styles

import './styles.scss';

// ----------------

export default class HealthInsuranceInfoForm extends Form {
  // Type of props

  static asStep = { displayName: 'Health Insurance Info', key: 'healthInsuranceInfo' };

  static propTypes = {
    className: types.string,
    style: types.object
  };

  // Default value for props

  static defaultProps = {
    className: ''
  };

  constructor(props) {
    super(props);

    this.submitAction = () => alert('Sending form...');

    // State of component

    this.state = {
      form: {
        healthInsurancePolicy: '',
        authorizedThirdParty: 'no',
        beneficiaryOccupation: '',
        endValidityPeriod: '',
        policyHolderName: '',
        beneficiaryId: '',
        headingCode: '',
        dependants: '',
        employed: 'unemployed'
      }
    };

    // Validation rules

    this.rules = {};

    // Bind methods, that are going to be called as an event handlers

    // ...

    // Init form

    this.init();
  }

  // -------- Methods --------

  // Callback on a successful network request. Optional

  successCallBack() {}

  // Transform form for send. Optional

  transformForm() {}

  // Render

  render() {
    const { className, style } = this.props;
    const { lan } = _global;

    return (
      <div className={`health-insurance-info-form ${className}`} style={style}>
        <PatientFormStruct proceedHandler={() => {}} backHandler={() => {}} skipHandler={() => {}}>
          <div>
            <Select
              {...lan.ui.select.healthInsurancePolicy.base}
              options={['ID', 'Passport', 'Driver card']}
              name="healthInsurancePolicy"
              ctx={this}
            />
            <Input {...lan.ui.input.policyHolderName.base} name="policyHolderName" ctx={this} />
            <DatePicker
              {...lan.ui.datePicker.endValidityPeriod.base}
              name="endValidityPeriod"
              ctx={this}
            />
            <Input {...lan.ui.input.beneficiaryId.base} name="beneficiaryId" ctx={this} />
            <Select
              {...lan.ui.select.beneficiaryOccupation.base}
              options={['ID', 'Passport', 'Driver card']}
              name="beneficiaryOccupation"
              ctx={this}
            />
            <Switch
              {...lan.ui.switch.employed.base}
              list={[
                // Selected/not-default option
                {
                  title: 'Employed',
                  itemName: 'employed'
                },
                // Default option
                {
                  title: 'Unemployed',
                  itemName: 'unemployed'
                }
              ]}
              name="employed"
              ctx={this}
            />
            <Select
              {...lan.ui.select.dependants.base}
              options={['ID', 'Passport', 'Driver card']}
              name="dependants"
              ctx={this}
            />
            <Switch
              {...lan.ui.switch.authorizedThirdParty.base}
              list={[
                // Selected/not-default option
                {
                  title: 'Yes',
                  itemName: 'yes'
                },
                // Default option
                {
                  title: 'No',
                  itemName: 'no'
                }
              ]}
              name="authorizedThirdParty"
              ctx={this}
            />
          </div>
        </PatientFormStruct>
      </div>
    );
  }
}
