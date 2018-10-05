import React from 'react';
import types from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// Constants

import { _global } from '../../../constants';

// Components

import { PacientSideInfoBlock, InfoCard, AlertCard } from '../../../components';

// Styles

import './styles.scss';

// Image and icons

import patientnotificationsIcon from '../../../static/img/icons/notifications_none.svg';
import patientProfileIcon from '../../../static/img/icons/patient_profile_icon.svg';
import patientCardioIcon from '../../../static/img/icons/Shape_cardio_icon.svg';

// ----------------

// Type of props

MainAsideBar.propTypes = {
  className: types.string,
  style: types.object
};

// Default value for props

MainAsideBar.defaultProps = {
  className: ''
};

// Modify styles

const modify = props =>
  classNames({
    'main-aside-bar--open': props.isAsideOpen
  });

// ----------------

export default function MainAsideBar(props) {
  const { className, style } = props;
  const { lan } = _global;

  // Dummy data

  const PROFILE_LINKS = [
    {
      title: lan.ui.aSidePatientBlock.patientProfile,
      linkTo: '/main/patients'
    },
    {
      title: lan.ui.aSidePatientBlock.emergencyContactPersons,
      linkTo: '/main/patients'
    },
    {
      title: lan.ui.aSidePatientBlock.evaluations,
      linkTo: '/main/patients'
    }
  ];

  const PATIENT_GENERAL_INFO = {
    date_birth: '1988-07-18',
    gender: 'male',
    unit: 'Unit name 1',
    bed: 456,
    patient_id: 654897435341,
    file_id: 654897435341,
    admission_date: '1988-07-18',
    duration_of_stay: 21
  };

  const ALERTS_LIST = [
    {
      alert_title: lan.ui.aSidePatientBlock.alert_block_monitoring,
      quantity_of_alert: 5,
      first_monitoring_title: 'First monitoring name',
      second_monitoring_title: 'Second monitoring name',
      linkTo: '/main/patients'
    },
    {
      alert_title: lan.ui.aSidePatientBlock.alert_block_allergy,
      quantity_of_alert: 2,
      first_monitoring_title: 'First monitoring name',
      second_monitoring_title: 'Second monitoring name',
      linkTo: '/main/patients'
    },
    {
      alert_title: lan.ui.aSidePatientBlock.alert_block_diagnosis,
      quantity_of_alert: 3,
      first_monitoring_title: 'First monitoring name',
      second_monitoring_title: 'Second monitoring name',
      linkTo: '/main/patients'
    }
  ];

  const VITAL_PARAMETRS = {
    weight: 65,
    blood_pressure: '128/256',
    temperature: 39.8,
    glyc: 1231
  };

  const patient_birth_date = moment(PATIENT_GENERAL_INFO.date_birth).format('DD.MM.YYYY');
  const patient_year = moment().diff(moment(PATIENT_GENERAL_INFO.date_birth), 'years');

  return (
    <aside className={`main-aside-bar ${modify(props)} ${className}`} style={style}>
      <div className="main-aside-bar--inner-wrapper">
        <PacientSideInfoBlock headerIcon={patientProfileIcon} headerTitle="Jonathan Anderson">
          <InfoCard
            label="Birth"
            value={`${patient_birth_date} (${patient_year} ${patient_year > 1 ? 'years' : 'year'})`}
          />
          <InfoCard label="Gender" value={PATIENT_GENERAL_INFO.gender} />
          <InfoCard label="Unit" value={PATIENT_GENERAL_INFO.unit} />
          <InfoCard label="Bed" value={PATIENT_GENERAL_INFO.bed} />
          <InfoCard label="Patient ID" value={PATIENT_GENERAL_INFO.patient_id} />
          <InfoCard label="File ID" value={PATIENT_GENERAL_INFO.file_id} />
          <InfoCard
            label="Admission date"
            value={moment(PATIENT_GENERAL_INFO.admission_date).format('DD.MM.YYYY')}
          />
          <InfoCard
            label="Duration of stay"
            value={`${PATIENT_GENERAL_INFO.duration_of_stay} ${
              PATIENT_GENERAL_INFO.duration_of_stay > 1 ? 'days' : 'day'
            }`}
          />
        </PacientSideInfoBlock>
        <PacientSideInfoBlock
          headerTitle={lan.ui.aSidePatientBlock.alert}
          alertCounter={10}
          headerIcon={patientnotificationsIcon}
        >
          {ALERTS_LIST.map(item => (
            <Link key={item.alert_title} to={item.linkTo}>
              <AlertCard data={item} />
            </Link>
          ))}
        </PacientSideInfoBlock>
        <PacientSideInfoBlock
          headerTitle={lan.ui.aSidePatientBlock.vitalParameters}
          headerIcon={patientCardioIcon}
        >
          <InfoCard label="Weight" value={`${VITAL_PARAMETRS.weight} kg`} />
          <InfoCard label="Blood Pressure" value={`${VITAL_PARAMETRS.blood_pressure} mmHg`} />
          <InfoCard label="Temperature" value={`${VITAL_PARAMETRS.temperature} c`} />
          <InfoCard label="Glyc" value={`${VITAL_PARAMETRS.glyc} mg/dl`} />
        </PacientSideInfoBlock>
        <div className="main-aside-bar__other-info-block">
          {PROFILE_LINKS.map(item => (
            <Link key={item.title} to={item.linkTo}>
              <div className="main-aside-bar__link-item">{item.title}</div>
            </Link>
          ))}
          <button onClick={() => {}} className="main-aside-bar__link-item">
            {lan.ui.button.changeStatus}
          </button>
          <button onClick={() => {}} className="main-aside-bar__link-item">
            {lan.ui.button.closePatientFile}
          </button>
        </div>
      </div>
    </aside>
  );
}
