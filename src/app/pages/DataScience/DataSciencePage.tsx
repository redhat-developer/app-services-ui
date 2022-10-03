import {
  DataSciencePage,
  ClusterObject,
} from "@rhoas/app-services-ui-components";
import { FunctionComponent } from "react";

export type ClustersResponse = {
  clusters: ClusterObject[];
  installableClusters: ClusterObject[];
};

function findValidClusterWithNodes(cluster: ClusterObject) {
  const hasWorkerNodes = !!cluster.metrics?.find(
    (metric: { nodes?: { compute: number } } = { nodes: { compute: 0 } }) =>
      metric && metric.nodes && metric.nodes.compute >= 2
  );
  return hasWorkerNodes;
}

const RHODS_ADDON_ID = "managed-odh";

async function fetchAddonInquirues(cluster: ClusterObject) {
  // TODO: FIx the data fetching according the app standards
  await window.insights.chrome.auth.getUser();
  const token = await window.insights.chrome.auth.getToken();
  const getCluster = fetch(
    `https://api.openshift.com/api/clusters_mgmt/v1/clusters/${cluster.cluster_id}/addon_inquiries?search=id='${RHODS_ADDON_ID}`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((d) => d.json());
  return getCluster.then(({ data }) => ({
    clusterId: cluster.cluster_id,
    ...data,
  }));
}

function getEligbleRHODSClusters({
  clusterId,
  items,
}: {
  clusterId: string;
  items: {
    id: string;
    requirements?: {
      enabled?: boolean;
      status: {
        fulfilled: boolean;
      };
    }[];
  }[];
}) {
  // may not be necessary in prod, Filtering on addon scope was not working with mocked server
  const internalItems = items.filter(({ id }) => id === RHODS_ADDON_ID);
  const hasAddon = !!internalItems.find((addon) =>
    addon?.requirements?.every(({ enabled }) => enabled)
  );
  const canInstallAddon = !!internalItems.find((addon) =>
    addon?.requirements?.every(({ status: { fulfilled } }) => fulfilled)
  );
  return { clusterId, hasAddon, canInstallAddon };
}

async function loadClusters(): Promise<ClustersResponse> {
  // TODO: FIx the data fetching according the app standards
  await window.insights.chrome.auth.getUser();
  const token = await window.insights.chrome.auth.getToken();
  const search = `plan_id='MOA'
  and status IN ('Active', 'Reserved')`;
  const { items: clusters } = await fetch(
    `https://api.openshift.com/api/accounts_mgmt/v1/subscriptions?search=${search}&fetchMetrics=true`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((d) => d.json() as unknown as { items: ClusterObject[] });
  const clusterswithNodes = clusters.filter((cluster) =>
    findValidClusterWithNodes(cluster)
  );
  const clusterAddonInquirues = await Promise.allSettled<{
    value: { clusterId: string };
  }>(clusterswithNodes.map(fetchAddonInquirues));
  const clustersAvailability: {
    [key: string]: {
      canInstallAddon: boolean;
      hasAddon: boolean;
      clusterId?: string;
    };
  } = (
    clusterAddonInquirues.filter(
      ({ status }) => status === "fulfilled"
    ) as unknown as { value: any }[]
  ).reduce((acc, { value }) => {
    const result = getEligbleRHODSClusters(value);
    return {
      ...acc,
      [result.clusterId]: result,
    };
  }, {});
  const installableClusters = clusterswithNodes.filter(
    ({ cluster_id }) => clustersAvailability[cluster_id]?.canInstallAddon
  );
  return {
    installableClusters,
    clusters,
  };
}

export const DataScienceOverViewPage: FunctionComponent = () => {
  return <DataSciencePage loadClusters={loadClusters} />;
};

export default DataScienceOverViewPage;
