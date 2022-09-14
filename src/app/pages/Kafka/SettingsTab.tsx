import { VoidFunctionComponent, useCallback } from "react";
import { useAuth, useConfig } from "@rhoas/app-services-ui-shared";
import { Settings } from "@rhoas/app-services-ui-components";
import { fetchSettings } from "./api";

type SettingsTabProps = {
  kafkaId: string;
  owner: string;
  reauthenticationEnabled: boolean;
};

export const SettingsTab: VoidFunctionComponent<SettingsTabProps> = ({
  kafkaId,
  owner,
  reauthenticationEnabled,
}) => {
  const auth = useAuth();
  const config = useConfig();

  const onSubmitReAuthentication = useCallback(
    (reauthenticationEnabled: boolean) => {
      return fetchSettings({
        kafkaId,
        basePath: config.kas.apiBasePath,
        accessToken: auth?.kas.getToken(),
        owner,
        settings: reauthenticationEnabled,
      });
    },
    [config.kas.apiBasePath, auth?.kas, owner, kafkaId]
  );

  return (
    <Settings
      onSubmitReAuthentication={onSubmitReAuthentication}
      reauthenticationEnabled={reauthenticationEnabled}
    />
  );
};
