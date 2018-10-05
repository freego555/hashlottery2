import React from 'react';
import types from 'prop-types';

// Components

import { MobileTableCard } from '../../../../components';

// ----------------

// Type of props

PatientsMobile.propTypes = {
  data: types.object
};

// ----------------

export default function PatientsMobile(props) {
  const { data, columns } = props;

  return (
    <MobileTableCard {...props}>
      {columns.map(item => {
        return {
          label: item.label,
          value:
            typeof item.dataName === 'string'
              ? data[item.dataName]
              : item.dataName.map(name => data[name]).join(' / ')
        };
      })}
    </MobileTableCard>
  );
}
