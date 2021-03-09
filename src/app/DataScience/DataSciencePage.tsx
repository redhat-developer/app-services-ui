import React from 'react';
import { Loading } from "@app/Components/Loading/Loading";
import LoremIpsum from "react-lorem-ipsum";
import {PageSection, PageSectionVariants} from "@patternfly/react-core";

export const DataSciencePage: React.FunctionComponent = () => {
  return (
    <PageSection variant={PageSectionVariants.light}>
      <h1>Data Science</h1>
      <LoremIpsum p={2}/>
    </PageSection>
  );
};
