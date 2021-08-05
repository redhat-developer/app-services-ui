import React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';

export const Loading: React.FunctionComponent = () => (
  <Bullseye>
    <Spinner />
  </Bullseye>
);
