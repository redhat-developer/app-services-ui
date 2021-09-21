import React from 'react';
import { Bullseye } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';

export const Loading: React.FunctionComponent = () => (
  <Bullseye>
    <Spinner />
  </Bullseye>
);
