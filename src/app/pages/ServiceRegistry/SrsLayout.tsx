import { FC, LazyExoticComponent, VoidFunctionComponent } from "react";
import { FederatedModule, KasModalLoader } from "@app/components";
import { Registry } from "@rhoas/registry-management-sdk";
import { AppServicesLoading } from "@rhoas/app-services-ui-components";
import { DownloadArtifacts } from "./DownloadArtifacts";
import { useAuth } from "@rhoas/app-services-ui-shared";

type SrsLayoutProps = {
  render: (registry: Registry) => JSX.Element;
  breadcrumbId?: string;
  artifactId?: string;
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
> = ({ Component, render, breadcrumbId, artifactId }) => {
  const auth = useAuth();

  return (
    <KasModalLoader>
      <Component
        render={render}
        breadcrumbId={breadcrumbId}
        tokenEndPointUrl={auth?.tokenEndPointUrl}
        artifactId={artifactId}
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
