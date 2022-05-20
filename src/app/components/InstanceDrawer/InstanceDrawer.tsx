import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMASToken } from '@app/hooks';

export function useKafkaInstanceDrawer() {
  const history = useHistory();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerActiveTab, setDrawerActiveTab] = useState<string | undefined>(undefined);

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

  const { getTokenEndPointUrl } = useMASToken();

  const onDeleteInstance = () => {
    history.push('/streams/kafkas');
  };

  return {
    isDrawerOpen,
    drawerActiveTab,
    setDrawerActiveTab,
    openDrawer,
    closeDrawer,
    tokenEndPointUrl: getTokenEndPointUrl(),
    onDeleteInstance,
  };
}
