import { Registry } from "@rhoas/registry-management-sdk";
import { FederatedApicurioComponent } from "./FederatedApicurioComponent";
import { FC } from "react";

type DownloadArtifactsProps = {
  registry: Registry;
  downloadLabel?: string;
};

export const DownloadArtifacts: FC<DownloadArtifactsProps> = ({
  registry,
  downloadLabel,
}) => {
  return (
    <FederatedApicurioComponent
      module="./FederatedDownloadArtifacts"
      registry={registry}
      fileName={registry.name}
      downloadLinkLabel={downloadLabel}
    />
  );
};
