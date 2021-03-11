import React from 'react';
import LoremIpsum from "react-lorem-ipsum";
import {PageSection, PageSectionVariants} from "@patternfly/react-core";

export const ServiceAccountsPage: React.FunctionComponent = () => {
  return (
    <PageSection variant={PageSectionVariants.light}>
      <h1>Service Accounts</h1>
      <LoremIpsum p={2}/>
    </PageSection>
  );
};
