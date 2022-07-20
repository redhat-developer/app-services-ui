import { ComponentType, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TermsAndConditionModal } from "@rhoas/app-services-ui-components";
import { useModalControl } from "@app/hooks";
import { ITermsConfig } from "@app/services";
import { useConstants } from "@app/providers/config/ServiceConstants";

export enum ServiceType {
  KAFKA,
  SERVICE_REGISTRY,
  CONNECTORS,
}

export function withTermsAndConditions<P>(
  WrappedComponent: ComponentType<P>,
  serviceType: ServiceType
) {
  const getServiceName = () => {
    switch (serviceType) {
      case ServiceType.KAFKA:
        return "common:Kafka";
      case ServiceType.SERVICE_REGISTRY:
        return "srsTemporaryFixMe:srs.service_registry";
      default:
        return "common:Kafka";
    }
  };

  return (props: P): JSX.Element => {
    const constants = useConstants();
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [url, setUrl] = useState<string>("");
    const serviceName = getServiceName();
    let eventCode = constants.kafka.ams.termsAndConditionsEventCode;
    let siteCode = constants.kafka.ams.termsAndConditionsSiteCode;

    if (serviceType === ServiceType.SERVICE_REGISTRY) {
      eventCode = constants.serviceRegistry.ams.termsAndConditionsEventCode;
      siteCode = constants.serviceRegistry.ams.termsAndConditionsSiteCode;
    }

    const { preCreateInstance, shouldOpenCreateModal } = useModalControl({
      eventCode,
      siteCode,
    } as ITermsConfig);

    const handlePreCreateInstance = useCallback(
      async (open: boolean) => {
        const { shouldOpenCreateModal, url } = await preCreateInstance(open);
        if (shouldOpenCreateModal === false && url) {
          setIsOpen(true);
          setUrl(url);
          return false;
        }
        return true;
      },
      [preCreateInstance, setIsOpen, setUrl]
    );

    const onCancel = useCallback(() => {
      setIsOpen(false);
    }, [setIsOpen]);

    const onClickViewTermsConditions = useCallback(async () => {
      window.location.href = url;
    }, [url]);

    return (
      <>
        <TermsAndConditionModal
          isModalOpen={isOpen}
          serviceName={t(serviceName)}
          onClickViewTermsConditions={onClickViewTermsConditions}
          onCancel={onCancel}
        />
        <WrappedComponent
          {...(props as P)}
          preCreateInstance={handlePreCreateInstance}
          shouldOpenCreateModal={shouldOpenCreateModal}
        />
      </>
    );
  };
}
