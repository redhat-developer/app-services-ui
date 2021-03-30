import React from 'react';
import { Loading } from "@app/Components/Loading/Loading";
import LoremIpsum from "react-lorem-ipsum";
import { PageSection, PageSectionVariants } from "@patternfly/react-core";

export const APIManagementPage: React.FunctionComponent = () => {
  return (
    <PageSection variant={PageSectionVariants.light}>
      <h1>API Management</h1>
      <LoremIpsum p={2}/>
    </PageSection>
  );
};
