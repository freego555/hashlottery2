import React from 'react';
import types from 'prop-types';

// Constants

import { _global } from '../../../../constants';

// Components

import { PatientFormStruct, Select, Switch, Input } from '../../../../components';

// Core

import Form from '../../../core/Form';

// Styles

import './styles.scss';

// ----------------

export default class SocialInfoForm extends Form {
  // Type of props

  static asStep = { displayName: 'Social Info', key: 'socialInfo' };

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
        regionalDisabilityRecognition: 'yes',
        federalDisabilityRecognition: 'no',
        disabilityAssessementPoints: '',
        financialPowerAttorney: 'yes',
        financialManagement: '',
        professionalCareer: '',
        currentOccupation: '',
        livingEnvironment: '',
        educationPathway: '',
        incomeOrigin: '',
        incomeAmount: '',
        education: '',
        expenses: '',
        debts: 'no'
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
      <div className={`social-info-form ${className}`} style={style}>
        <PatientFormStruct
          proceedHandler={() => {}}
          proceedAsSave
          backHandler={() => {}}
          skipHandler={() => {}}
        >
          <div>
            <Switch
              {...lan.ui.switch.federalDisabilityRecognition.base}
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
              name="federalDisabilityRecognition"
              ctx={this}
            />
            <Input
              {...lan.ui.input.disabilityAssessementPoints.base}
              name="disabilityAssessementPoints"
              ctx={this}
            />
            <Switch
              {...lan.ui.switch.regionalDisabilityRecognition.base}
              list={[
                // Default option
                {
                  title: 'Yes',
                  itemName: 'yes'
                },
                // Selected/not-default option
                {
                  title: 'No',
                  itemName: 'no'
                }
              ]}
              name="regionalDisabilityRecognition"
              ctx={this}
            />
            <Select
              {...lan.ui.select.incomeOrigin.base}
              options={['ID', 'Passport', 'Driver card']}
              name="incomeOrigin"
              ctx={this}
            />
            <Input {...lan.ui.input.incomeAmount.base} name="incomeAmount" ctx={this} />
            <Input {...lan.ui.input.expenses.base} name="expenses" ctx={this} />
            <Switch
              {...lan.ui.switch.debts.base}
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
              name="debts"
              ctx={this}
            />
            <Switch
              {...lan.ui.switch.financialPowerAttorney.base}
              list={[
                // Default option
                {
                  title: 'Yes',
                  itemName: 'yes'
                },
                // Selected/not-default option
                {
                  title: 'No',
                  itemName: 'no'
                }
              ]}
              name="financialPowerAttorney"
              ctx={this}
            />
            <Input
              {...lan.ui.input.financialManagement.base}
              name="financialManagement"
              ctx={this}
            />
            <Select
              {...lan.ui.select.livingEnvironment.base}
              options={['ID', 'Passport', 'Driver card']}
              name="livingEnvironment"
              ctx={this}
            />
            <Input {...lan.ui.input.currentOccupation.base} name="currentOccupation" ctx={this} />
            <Input {...lan.ui.input.professionalCareer.base} name="professionalCareer" ctx={this} />
            <Select
              {...lan.ui.select.education.base}
              options={['ID', 'Passport', 'Driver card']}
              name="education"
              ctx={this}
            />
            <Select
              {...lan.ui.select.educationPathway.base}
              options={['ID', 'Passport', 'Driver card']}
              name="educationPathway"
              ctx={this}
            />
          </div>
        </PatientFormStruct>
      </div>
    );
  }
}
