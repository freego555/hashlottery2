import React from 'react';
import types from 'prop-types';

// Constants

import { _global } from '../../../../constants';

// Components

import {
  PatientFormStruct,
  DatePicker,
  Textarea,
  Select,
  Switch,
  Input
} from '../../../../components';

// Core

import Form from '../../../core/Form';

// ----------------

export default class PatientInfoForm extends Form {
  // Type of props

  static asStep = { displayName: _global.lan.forms.patientInfoForm.formTitle, key: 'patientInfo' };

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
        // First block
        identityDocumentType: '',
        identityCardNumber: '',
        identityCardType: '',
        patientFullName: '',
        // Second block
        nationalRegister: '',
        foreignRegister: '',
        maritalStatus: '',
        partnersName: '',
        nationality: '',
        birthDate: '',
        postCode: '',
        language: '',
        country: '',
        address: '',
        gender: '',
        // Third block
        generalPractitioner: '',
        emailAddress: '',
        phoneNumber: '',
        confidential: 'no',
        religion: '',
        note: ''
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
      <div className={`patient-info-form ${className}`} style={style}>
        <PatientFormStruct proceedHandler={() => {}}>
          <div>
            <Input {...lan.ui.input.patientFullName.base} name="patientFullName" ctx={this} />
            <Input {...lan.ui.input.identityCardNumber.base} name="identityCardNumber" ctx={this} />
            <Select
              {...lan.ui.select.identityCardType.base}
              options={['ID', 'Passport', 'Driver card']}
              name="identityCardType"
              ctx={this}
            />
            <Select
              {...lan.ui.select.identityDocumentType.base}
              options={['ID', 'Passport', 'Driver card']}
              name="identityDocumentType"
              ctx={this}
            />
          </div>
          <div>
            <Select
              {...lan.ui.select.language.base}
              options={['English', 'Ukrainian', 'Russian']}
              name="language"
              ctx={this}
            />
            <DatePicker {...lan.ui.datePicker.birthDate.base} name="birthDate" ctx={this} />
            <Select
              {...lan.ui.select.gender.base}
              options={['Male', 'Female']}
              name="gender"
              ctx={this}
            />
            <Select
              {...lan.ui.select.maritalStatus.base}
              options={['Unwed', 'Married']}
              name="maritalStatus"
              ctx={this}
            />
            <Input {...lan.ui.input.partnersName.base} name="partnersName" ctx={this} />
            <Select
              {...lan.ui.select.nationality.base}
              options={['English', 'Ukrainian', 'Russian']}
              name="nationality"
              ctx={this}
            />
            <Select
              {...lan.ui.select.country.base}
              options={['United Kindom', 'Ukraine', 'Russia']}
              name="nationality"
              ctx={this}
            />
            <Input {...lan.ui.input.postCode.base} name="postCode" ctx={this} />
            <Input {...lan.ui.input.address.base} name="address" ctx={this} className="fullWidth" />
            <Input {...lan.ui.input.nationalRegister.base} name="nationalRegister" ctx={this} />
            <Input {...lan.ui.input.foreignRegister.base} name="foreignRegister" ctx={this} />
          </div>
          <div>
            <Input {...lan.ui.input.phoneNumber.base} name="phoneNumber" ctx={this} />
            <Input {...lan.ui.input.emailAddress.base} name="emailAddress" ctx={this} />
            <Switch
              {...lan.ui.switch.confidential.base}
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
              name="confidential"
              ctx={this}
            />
            <Select
              {...lan.ui.select.religion.base}
              options={['Christianity', 'Islam', 'Buddhism', 'Judaism', 'Hinduism']}
              name="religion"
              ctx={this}
            />
            <Input
              {...lan.ui.input.generalPractitioner.base}
              name="generalPractitioner"
              ctx={this}
            />
            <DatePicker {...lan.ui.datePicker.deathDate.base} name="deathDate" ctx={this} />
            <Textarea {...lan.ui.input.note.base} name="note" ctx={this} className="fullWidth" />
          </div>
        </PatientFormStruct>
      </div>
    );
  }
}
