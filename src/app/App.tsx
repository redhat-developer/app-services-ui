import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, Provider } from 'react-redux';
import './App.scss';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import { notifications, NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications/';
import { AppRoutes } from '@app/Routes';
import { FederatedModuleProvider } from './components/FederatedModule/FederatedModule';
import { InsightsType } from '@app/utils';

const registry = getRegistry();
registry.register({ notifications });

export const App: React.FunctionComponent = () => {
  const insights: InsightsType = window['insights'];
  const history = useHistory();

  const getAppId = () => {
    const defaultAppId = 'overview';

    const parts = history.location.pathname.split('/');
    if (parts.length > 1) {
      if (parts[1] === '') {
        return defaultAppId;
      } else {
        if (parts[1] === 'openshift-streams') {
          return 'streams';
        }
        return parts[1];
      }
    } else {
      return defaultAppId;
    }
  };

  useEffect(() => {
    insights.chrome.init();
    const appId = getAppId();
    insights.chrome.identifyApp(appId);

    insights.chrome.on('APP_NAVIGATION', (event) => {
      const streamUrls = ['kafkas', 'service-accounts', 'resources'];
      history.push(`/${streamUrls.includes(event.navId) ? 'streams/' : ''}${event.navId}`);
    });
  }, []);

  return (
    <Provider store={registry.getStore()}>
      <FederatedModuleProvider>
        <NotificationsPortal />
        <AppRoutes />
      </FederatedModuleProvider>
    </Provider>
  );
};

/**
 * connect: https://github.com/reactjs/react-redux/blob/master/docs/api.md
 *          https://reactjs.org/docs/higher-order-components.html
 */
export default connect()(App);
