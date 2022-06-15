import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "@app/providers/auth";

export function useKafkaInstanceDrawer() {
  const history = useHistory();
  const auth = useAuth();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerActiveTab, setDrawerActiveTab] = useState<string | undefined>(
    undefined
  );

  const openDrawer = useCallback((tab: string | undefined) => {
    if (tab) {
      setDrawerActiveTab(tab);
    }
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerActiveTab(undefined);
    setIsDrawerOpen(false);
  }, []);

  const onDeleteInstance = () => {
    history.push("/streams/kafkas");
  };

  return {
    isDrawerOpen,
    drawerActiveTab,
    setDrawerActiveTab,
    openDrawer,
    closeDrawer,
    tokenEndPointUrl: auth?.tokenEndPointUrl,
    onDeleteInstance,
  };
}
