import {
  LazyExoticComponent,
  useCallback,
  useState,
  VoidFunctionComponent,
} from "react";
import { useTranslation } from "react-i18next";
import { FederatedModule, KasModalLoader } from "@app/components";
import { ServiceDownPage } from "@app/pages";
import { useModalControl, useQuota } from "@app/hooks";
import {
  AppServicesLoading,
  DevelopmentPreview,
  TermsAndConditionModal,
} from "@rhoas/app-services-ui-components";
import {
  ProductType,
  QuotaContext,
  useConfig,
} from "@rhoas/app-services-ui-shared";
import { Registry } from "@rhoas/registry-management-sdk";
import { ITermsConfig } from "@app/services";
import { DownloadArtifacts } from "./DownloadArtifacts";
import { useConstants } from "@app/providers/config/ServiceConstants";
import { useAuth } from "@app/providers/auth";

export const ServiceRegistryPage: VoidFunctionComponent = () => {
  const { getQuota } = useQuota(ProductType.srs);

  return (
    <QuotaContext.Provider value={{ getQuota }}>
      <KasModalLoader>
        <FederatedModule
          scope="srs"
          module="./ServiceRegistry"
          fallback={<AppServicesLoading />}
          render={(component) => (
            <ServiceRegistryPageConnected Component={component} />
          )}
        />
      </KasModalLoader>
    </QuotaContext.Provider>
  );
};

export const ServiceRegistryPageConnected: VoidFunctionComponent<{
  Component: LazyExoticComponent<any>;
}> = ({ Component }) => {
  const config = useConfig();
  const auth = useAuth();
  const { t } = useTranslation();

  const constants = useConstants();
  const { preCreateInstance, shouldOpenCreateModal } = useModalControl({
    eventCode: constants.serviceRegistry.ams.termsAndConditionsEventCode,
    siteCode: constants.serviceRegistry.ams.termsAndConditionsSiteCode,
  } as ITermsConfig);

  //states
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");

  const handlePreCreateInstance = useCallback(
    async (open: boolean) => {
      const { shouldOpenCreateModal, url } = await preCreateInstance(open);
      if (shouldOpenCreateModal === false && url) {
        setIsOpenModal(true);
        setUrl(url);
        return false;
      }
      return true;
    },
    [preCreateInstance, setIsOpenModal, setUrl]
  );

  const onClsoeModal = useCallback(() => {
    setIsOpenModal(false);
  }, [setIsOpenModal]);

  const onClickViewTermsConditions = useCallback(async () => {
    window.location.href = url;
  }, [url]);

  // Wait for the config and the registry to load
  if (config === undefined) {
    return <AppServicesLoading />;
  }

  if (config.serviceDown) {
    return <ServiceDownPage />;
  }

  return (
    <>
      <TermsAndConditionModal
        isModalOpen={isOpenModal}
        serviceName={t("srsTemporaryFixMe:srs.service_registry")}
        onClickViewTermsConditions={onClickViewTermsConditions}
        onCancel={onClsoeModal}
      />
      <DevelopmentPreview>
        <Component
          preCreateInstance={handlePreCreateInstance}
          shouldOpenCreateModal={shouldOpenCreateModal}
          tokenEndPointUrl={auth?.tokenEndPointUrl}
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
      </DevelopmentPreview>
    </>
  );
};

export default ServiceRegistryPage;
