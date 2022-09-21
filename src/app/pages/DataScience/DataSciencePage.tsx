import {
  ClustersResponse,
  DataSciencePage,
} from "@rhoas/app-services-ui-components";
import { FunctionComponent } from "react";

const noClustersResponse: ClustersResponse = {
  clusters: [],
  installableClusters: [],
};

export const DataScienceOverViewPage: FunctionComponent = () => {
  return (
    <DataSciencePage loadClusters={() => Promise.resolve(noClustersResponse)} />
  );
};

export default DataScienceOverViewPage;
