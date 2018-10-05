import React from 'react';

// Constants

import { _global } from '../../../constants';

// Components

import {
  PatientsDesktop,
  PatientsMobile,
  RoundButton,
  SearchForm,
  Container,
  Table,
  Page
} from '../../../components';

// Styles

import './styles.scss';

// ----------------

export default class PatientsPage extends Page {
  // Page (Route) config

  static exactPath = true;
  static title = _global.lan.pages.patientsPage.title;
  static path = '/main/patients';

  // -------- Methods --------

  // Render

  render() {
    const { lan } = _global;

    return (
      <div className="patients-page">
        <div className="search-header">
          <SearchForm className="search-form--max-full-width" withOutBorder={false} />
        </div>
        <Container
          mapState={state => ({ mobile: state.config.isMobile })}
          childProps={{
            columns: [
              {
                label: lan.pages.patientsPage.mainTableHeader.fileId,
                width: 13,
                dataName: 'file_id'
              },
              {
                label: lan.pages.patientsPage.mainTableHeader.patientId,
                width: 13,
                dataName: 'patient_id'
              },
              {
                label: lan.pages.patientsPage.mainTableHeader.fullNameGender,
                width: 26,
                dataName: ['full_name', 'gender'],
                sort: 'full_name'
              },
              {
                label: lan.pages.patientsPage.mainTableHeader.unitBed,
                width: 12,
                dataName: ['unit', 'bed'],
                sort: 'unit'
              },
              {
                label: lan.pages.patientsPage.mainTableHeader.taskOpenDue,
                width: 18,
                dataName: ['task_open', 'task_due'],
                sort: 'task_open'
              },
              {
                label: lan.pages.patientsPage.mainTableHeader.status,
                width: 18,
                dataName: 'status',
                sort: 'status'
              }
            ],
            rowDesktop: PatientsDesktop,
            rowMobile: PatientsMobile,
            list: [
              {
                file_id: 23123123,
                patient_id: 123123,
                full_name: 'Isabella Sherman',
                gender: 'f',
                unit: 'u5',
                bed: 'b4',
                task_open: 5,
                task_due: 1,
                status: 'Temporary released'
              },
              {
                file_id: 23123123,
                patient_id: 123123,
                full_name: 'Vlad Tanos',
                gender: 'f',
                unit: 'u5',
                bed: 'b4',
                task_open: 5,
                task_due: 1,
                status: 'Temporary released'
              },
              {
                file_id: 23123123,
                patient_id: 123123,
                full_name: 'Vlad Venom',
                gender: 'f',
                unit: 'u5',
                bed: 'b4',
                task_open: 5,
                task_due: 1,
                status: 'Temporary released'
              },
              {
                file_id: 23123123,
                patient_id: 123123,
                full_name: 'Isabella Sherman',
                gender: 'f',
                unit: 'u5',
                bed: 'b4',
                task_open: 5,
                task_due: 1,
                status: 'Temporary released'
              },
              {
                file_id: 23123123,
                patient_id: 123123,
                full_name: 'Isabella Sherman',
                gender: 'f',
                unit: 'u5',
                bed: 'b4',
                task_open: 5,
                task_due: 1,
                status: 'Temporary released'
              }
            ]
          }}
        >
          {Table}
        </Container>
        <div className="round-button-container">
          <RoundButton linkTo="/main/patients/new" />
        </div>
      </div>
    );
  }
}
