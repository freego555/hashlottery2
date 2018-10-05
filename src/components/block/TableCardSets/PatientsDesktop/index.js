import React from 'react';
import types from 'prop-types';

// Components

import { DesktopTableCard, DesktopTableCustomCell } from '../../../../components';

// ----------------

// Type of props

PatientsDesktop.propTypes = {
  data: types.object
};

// ----------------

export default function PatientsDesktop(props) {
  const { data } = props;

  return (
    <DesktopTableCard {...props}>
      {data.file_id}
      {data.patient_id}
      {`${data.full_name} (${data.gender})`}
      <DesktopTableCustomCell uppercase>{`${data.unit} / ${data.bed}`}</DesktopTableCustomCell>
      {`${data.task_open} / ${data.task_due}`}
      {data.status}
    </DesktopTableCard>
  );
}
