import React from 'react';

// Constants

import { _global } from '../../../constants';

// Components

import {
  HealthInsuranceInfoForm,
  PatientInfoForm,
  BaseStepsHeader,
  SocialInfoForm,
  BaseStepsBody,
  PageTitle,
  Steps,
  Page
} from '../../../components';

// ----------------

export default class NewPatientPage extends Page {
  // Route config

  static title = _global.lan.pages.newPatientPage.title;
  static path = '/main/patients/new';

  // Bind methods

  pageContent = this.pageContent.bind(this);

  // -------- Methods --------

  // Content of route

  pageContent() {
    return (
      <React.Fragment>
        <PageTitle>{_global.lan.forms.patientInfoForm.title}</PageTitle>
        <Steps
          header={BaseStepsHeader}
          body={BaseStepsBody}
          activeStepIndex={0}
          style={{ height: 'calc(100% - 48px)' }}
        >
          {PatientInfoForm}
          {HealthInsuranceInfoForm}
          {SocialInfoForm}
        </Steps>
      </React.Fragment>
    );
  }

  // Render

  render() {
    return this.securRenderPage(this.pageContent);
  }
}
