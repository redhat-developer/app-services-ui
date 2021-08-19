import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { accessibleRouteChangeHandler, useDocumentTitle } from '@app/utils';
import { LastLocationProvider, useLastLocation } from 'react-router-last-location';
import { BasenameContext } from '@bf2/ui-shared';
import getBaseName from './utils/getBaseName';
import { DevelopmentPreview, Loading } from '@app/components';
const QuickStartLoaderFederated = React.lazy(() => import('@app/pages/Resources/QuickStartLoaderFederated'));

const APIManagementPage = React.lazy(() => import('@app/pages/APIManagement/APIManagementPage'));
const ArtifactRedirect = React.lazy(() => import('@app/pages/ServiceRegistry/ArtifactsRedirect'));
const Artifacts = React.lazy(() => import('@app/pages/ServiceRegistry/Artifacts'));
const ArtifactVersionDetails = React.lazy(() => import('@app/pages/ServiceRegistry/ArtifactVersion'));
const DataSciencePage = React.lazy(() => import('@app/pages/DataScience/DataSciencePage'));
const KafkaPage = React.lazy(() => import('@app/pages/Kafka/KafkaPage'));
const KasPage = React.lazy(() => import('@app/pages/Kas/KasPage'));
const NotFoundPage = React.lazy(() => import('@app/pages/NotFound/NotFoundPage'));
const OverviewPage = React.lazy(() => import('@app/pages/Overview/OverviewPage'));
const ResourcesPage = React.lazy(() => import('@app/pages/Resources/ResourcesPage'));
const RulesPage = React.lazy(() => import('@app/pages/ServiceRegistry/RulesPage'));
const ServiceAccountsPage = React.lazy(() => import('@app/pages/ServiceAccounts/ServiceAccountsPage'));
const CosPage = React.lazy(() => import('@app/pages/CosPage/CosPage'));
const ServiceRegistryPage = React.lazy(() => import('@app/pages/ServiceRegistry/ServiceRegistryPage'));

let routeFocusTimer: number;

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  isAsync?: boolean;
  routes?: undefined;
  basename?: string;
  devPreview?: boolean;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const RedirectToOverview: React.FunctionComponent = () => <Redirect to="/overview" />;
const RedirectToStreamsKafkas: React.FunctionComponent = () => <Redirect to="/streams/kafkas" />;

const routes: AppRouteConfig[] = [
  {
    component: KafkaPage,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/streams/kafkas/:id',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    basename: '/streams/kafkas',
    devPreview: true,
  },
  {
    component: KafkaPage,
    exact: false,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/streams/kafkas/:id/topics/:topicName',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    basename: '/streams/kafkas',
    devPreview: true,
  },
  {
    // Handle the redirect from application-services/streams to application-services/streams/kafkas
    component: RedirectToStreamsKafkas,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/streams',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
  },
  {
    component: RedirectToStreamsKafkas,
    // Handle the redirect for the old url application-services/openshift-streams to application-services/streams/kafkas
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/openshift-streams',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
  },
  {
    component: KasPage,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/streams/kafkas',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    basename: '/streams/kafkas',
    devPreview: true,
  },
  {
    component: ServiceRegistryPage,
    exact: true,
    label: 'Service Registry',
    path: '/sr',
    title: 'Service Registry',
    basename: '/sr',
  },
  {
    component: Artifacts,
    exact: true,
    label: 'Service Registry',
    path: '/sr/t/:tenantId',
    title: 'Service Registry',
    basename: '/sr',
    devPreview: true,
  },
  {
    component: Artifacts,
    exact: true,
    label: 'Service Registry',
    path: '/sr/t/:tenantId/artifacts',
    title: 'Service Registry',
    basename: '/sr',
  },
  {
    component: RulesPage,
    exact: true,
    label: 'Service Registry',
    path: '/sr/t/:tenantId/rules',
    title: 'Service Registry',
    basename: '/sr',
    devPreview: true,
  },
  {
    component: ArtifactRedirect,
    exact: true,
    label: 'Service Registry',
    path: '/sr/t/:tenantId/artifacts/:groupId/:artifactId',
    title: 'Service Registry',
    basename: '/sr',
  },
  {
    component: ArtifactVersionDetails,
    exact: true,
    label: 'Service Registry',
    path: '/sr/t/:tenantId/artifacts/:groupId/:artifactId/versions/:version',
    title: 'Service Registry',
    basename: '/sr',
    devPreview: true,
  },
  {
    component: CosPage,
    exact: false,
    label: 'COS',
    path: '/cos',
    title: 'COS',
    basename: `${getBaseName(window.location.pathname)}/cos`,
    devPreview: true,
  },
  {
    component: ServiceAccountsPage,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/streams/service-accounts',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    basename: '/streams',
    devPreview: true,
  },
  {
    component: OverviewPage,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/overview',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
  },
  {
    component: RedirectToOverview,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
  },
  {
    component: APIManagementPage,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/api-management',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
  },
  {
    component: DataSciencePage,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/data-science',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
  },
  {
    component: ResourcesPage,
    exact: true,
    label: 'QuickStarts for Red Hat OpenShift Application Services',
    path: '/streams/resources',
    title: 'QuickStarts for Red Hat OpenShift Application Services',
    devPreview: true,
  },
];

// a custom hook for sending focus to the primary content container
// after a view has loaded so that subsequent press of tab key
// sends focus directly to relevant content
const useA11yRouteChange = (isAsync: boolean) => {
  const lastNavigation = useLastLocation();
  React.useEffect(() => {
    if (!isAsync && lastNavigation !== null) {
      routeFocusTimer = accessibleRouteChangeHandler();
    }
    return () => {
      window.clearTimeout(routeFocusTimer);
    };
  }, [isAsync, lastNavigation]);
};

const WrappedRoute = ({ component: Component, isAsync = false, title, basename, devPreview, ...rest }: IAppRoute) => {
  useA11yRouteChange(isAsync);
  useDocumentTitle(title);
  const getBasename = () => {
    return basename || '';
  };

  function wrapRoute(routeProps: RouteComponentProps) {
    return (
        <DevelopmentPreview show={devPreview}>
          <BasenameContext.Provider value={{ getBasename }}>
            <Component {...rest} {...routeProps} />
          </BasenameContext.Provider>
        </DevelopmentPreview>
    );
  }

  return <Route render={wrapRoute} {...rest} />;
};

const PageNotFound = ({ title }: { title: string }) => {
  useDocumentTitle(title);
  return <Route component={NotFoundPage} />;
};

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[]
);

const AppRoutes = (): React.ReactElement => (
  <>
    <LastLocationProvider>
      <React.Suspense fallback={<Loading />}>
        <Switch>
          {flattenedRoutes.map(({ path, exact, component, title, isAsync, ...rest }, idx) => (
            <WrappedRoute
              path={path}
              exact={exact}
              component={component}
              key={idx}
              title={title}
              isAsync={isAsync}
              {...rest}
            />
          ))}
          <PageNotFound title="404 Page Not Found" />
        </Switch>
      </React.Suspense>
    </LastLocationProvider>
    <QuickStartLoaderFederated />
  </>
);

export { AppRoutes, routes };
