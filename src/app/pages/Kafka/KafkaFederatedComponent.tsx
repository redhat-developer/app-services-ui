import { FederatedModule } from "@app/components";
import React from "react";

export type KafkaFederatedComponentProps = UnderlyingProps & {
  module: string
}

export type UnderlyingProps = {
  activeTab?: number;
  getToken?: () => Promise<string>
  apiBasePath: string
  kafkaName?: string;
  kafkaPageLink?: string;
  kafkaInstanceLink?: string;
  onError?: (errorCode: number, message?: string) => void;
  handleInstanceDrawer?: (isOpen: boolean, activeTab?: string) => void;
  setIsOpenDeleteInstanceModal?: (isOpenModal: boolean) => void;
  showMetrics?: JSX.Element | undefined;
}

// Provides properties for component path and it's underlying properties
export const KafkaFederatedComponent: React.FunctionComponent<KafkaFederatedComponentProps> = ({
                                                                                                 module, ...rest
                                                                                               }) => {
  return <FederatedModule
    data-ouia-app-id="dataPlane-streams"
    scope="kafka"
    module={module}
    render={(FederatedKafka) => (
      <FederatedKafka
        {...rest}
      />
    )}
  />
}
