import { useState, VoidFunctionComponent } from "react";
import { useAuth, useConfig } from "@rhoas/app-services-ui-shared";
import {
  AlertStatus,
  Settings,
  SettingsStatus,
} from "@rhoas/app-services-ui-components";
import { fetchSettings } from "./api";
import { KafkaUpdateRequest } from "@rhoas/kafka-management-sdk";

type SettingsTabProps = {
  kafkaId: string;
  updateKafka: KafkaUpdateRequest;
};

export const SettingsTab: VoidFunctionComponent<SettingsTabProps> = ({
  kafkaId,
  updateKafka,
}) => {
  const auth = useAuth();
  const config = useConfig();

  const [connectionStatus, setConnectionStatus] =
    useState<SettingsStatus>("On");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [alertStatus, setAlertStatus] = useState<AlertStatus>();

  const [connectionState, setConnectionState] = useState<boolean>(false);

  const onSwitchClick = () => {
    if (connectionStatus === "On") {
      setIsModalOpen(true);
    } else {
      setConnectionStatus("TurningOn");
      async () => {
        try {
          await fetchSettings({
            kafkaId,
            basePath: config.kas.apiBasePath,
            accessToken: auth?.kas.getToken(),
            updateKafka,
          }).then(() => {
            setConnectionStatus("On");
            setConnectionState(true);
            setAlertStatus("success");
          });
        } catch (err) {
          setConnectionStatus("Off");
          setAlertStatus("danger");
        }
      };
    }
  };

  const onClickClose = () => {
    setIsModalOpen(false);
  };

  const onClickTurnOff = () => {
    setIsModalOpen(false);
    setConnectionStatus("TurningOff");
    async () => {
      try {
        await fetchSettings({
          kafkaId,
          basePath: config.kas.apiBasePath,
          accessToken: auth?.kas.getToken(),
          updateKafka,
        }).then(() => {
          setConnectionStatus("Off");
          setConnectionState(false);
          setAlertStatus("success");
        });
      } catch (err) {
        setConnectionStatus("On");
        setAlertStatus("danger");
      }
    };
  };

  return (
    <Settings
      connectionStatus={connectionStatus}
      onSwitchClick={onSwitchClick}
      isModalOpen={isModalOpen}
      onClickTurnOff={onClickTurnOff}
      alertStatus={alertStatus}
      connectionState={connectionState}
      onClickClose={onClickClose}
    />
  );
};
