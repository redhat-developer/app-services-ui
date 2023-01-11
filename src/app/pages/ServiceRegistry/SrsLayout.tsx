import { FC, LazyExoticComponent, VoidFunctionComponent } from "react";
import { FederatedModule, KasModalLoader } from "@app/components";
import { Registry } from "@rhoas/registry-management-sdk";
import { AppServicesLoading } from "@rhoas/app-services-ui-components";
import { DownloadArtifacts } from "./DownloadArtifacts";
import { useAuth } from "@app/providers/auth";

type SrsLayoutProps = {
  render: (registry: Registry) => JSX.Element;
  breadcrumbId?: string;
  groupId?: string;
  artifactId?: string;
  version?: string;
};

export const SrsLayout: FC<SrsLayoutProps> = (props) => {
  return (
    <FederatedModule
      scope="srs"
      module="./ApicurioRegistry"
      fallback={<AppServicesLoading />}
      render={(component) => (
        <SrsLayoutConnected Component={component} {...props} />
      )}
    />
  );
};

const SrsLayoutConnected: VoidFunctionComponent<
  { Component: LazyExoticComponent<any> } & SrsLayoutProps
> = ({ Component, render, breadcrumbId, groupId, artifactId, version }) => {
  const auth = useAuth();

  return (
    <KasModalLoader>
      <Component
        render={render}
        breadcrumbId={breadcrumbId}
        tokenEndPointUrl={auth?.tokenEndPointUrl}
        groupId={groupId}
        artifactId={artifactId}
        version={version}
        renderDownloadArtifacts={(
          registry: Registry,
          downloadLabel?: string
        ) => (
          <DownloadArtifacts
            registry={registry}
            downloadLabel={downloadLabel}
          />
        )}
      />
    </KasModalLoader>
  );
};
