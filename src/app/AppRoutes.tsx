import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import getBaseName from './utils/getBaseName';
import { DevelopmentPreview } from '@rhoas/app-services-ui-components';
import { AppRouteConfig, flattenedRoutes, IAppRoute, PageNotFoundRoute, useA11yRouteChange } from '@app/utils/Routing';
import { useDocumentTitle } from '@app/utils';
import { KafkaMainView } from '@app/pages/Kafka';
import { BasenameContext } from '@rhoas/app-services-ui-shared';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';

const QuickStartLoaderFederated = React.lazy(() => import('@app/pages/Resources/QuickStartLoaderFederated'));

const APIManagementPage = React.lazy(() => import('@app/pages/APIManagement/APIManagementPage'));
const ArtifactRedirect = React.lazy(() => import('@app/pages/ServiceRegistry/ArtifactsRedirect'));
const Artifacts = React.lazy(() => import('@app/pages/ServiceRegistry/Artifacts'));
const ArtifactVersionDetails = React.lazy(() => import('@app/pages/ServiceRegistry/ArtifactVersion'));
const DataSciencePage = React.lazy(() => import('@app/pages/DataScience/DataSciencePage'));

const KasPage = React.lazy(() => import('@app/pages/Kas/KasPage'));
const OverviewPage = React.lazy(() => import('@app/pages/Overview/OverviewPage'));
const ResourcesPage = React.lazy(() => import('@app/pages/Resources/ResourcesPage'));
const RulesPage = React.lazy(() => import('@app/pages/ServiceRegistry/RulesPage'));
const RolesPage = React.lazy(() => import('@app/pages/ServiceRegistry/RolesPage'));
const ServiceAccountsPage = React.lazy(() => import('@app/pages/ServiceAccounts/ServiceAccountsPage'));
const CosPage = React.lazy(() => import('@app/pages/CosPage/CosPage'));
const ServiceRegistryPage = React.lazy(() => import('@app/pages/ServiceRegistry/ServiceRegistryPage'));

const RedirectToOverview: React.FunctionComponent = () => <Redirect to="/overview" />;
const RedirectToStreamsKafkas: React.FunctionComponent = () => <Redirect to="/streams/kafkas" />;
const RedirectToServiceAccounts: React.FunctionComponent = () => <Redirect to="/service-accounts" />;
const RedirectToResources: React.FunctionComponent = () => <Redirect to="/learning-resources" />;

const appRoutes: AppRouteConfig<any>[] = [
  {
    component: KafkaMainView,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/streams/kafkas/:id',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    basename: '/streams/kafkas/:id',
    devPreview: false,
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
    devPreview: false,
  },
  {
    component: ServiceRegistryPage,
    exact: true,
    label: 'Service Registry',
    path: '/service-registry',
    title: 'Service Registry | Red Hat OpenShift Application Services',
    basename: '/service-registry',
  },
  {
    component: Artifacts,
    exact: true,
    label: 'Service Registry',
    path: '/service-registry/t/:tenantId',
    title: 'Service Registry | Red Hat OpenShift Application Services',
    basename: '/service-registry',
  },
  {
    component: Artifacts,
    exact: true,
    label: 'Service Registry',
    path: '/service-registry/t/:tenantId/artifacts',
    title: 'Service Registry | Red Hat OpenShift Application Services',
    basename: '/service-registry',
  },
  {
    component: RulesPage,
    exact: true,
    label: 'Service Registry',
    path: '/service-registry/t/:tenantId/rules',
    title: 'Service Registry | Red Hat OpenShift Application Services',
    basename: '/service-registry',
  },
  {
    component: RolesPage,
    exact: true,
    label: 'Service Registry',
    path: '/service-registry/t/:tenantId/roles',
    title: 'Service Registry | Red Hat OpenShift Application Services',
    basename: '/service-registry',
  },
  {
    component: ArtifactRedirect,
    exact: true,
    label: 'Service Registry',
    path: '/service-registry/t/:tenantId/artifacts/:groupId/:artifactId',
    title: 'Service Registry | Red Hat OpenShift Application Services',
    basename: '/service-registry',
  },
  {
    component: ArtifactVersionDetails,
    exact: true,
    label: 'Service Registry',
    path: '/service-registry/t/:tenantId/artifacts/:groupId/:artifactId/versions/:version',
    title: 'Service Registry | Red Hat OpenShift Application Services',
    basename: '/service-registry',
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
    path: '/service-accounts',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    devPreview: false,
  },
  {
    component: RedirectToServiceAccounts,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/streams/service-accounts',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    devPreview: false,
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
    // Handle the redirect for the old url application-services/streams/resources to application-services/learning-resources
    component: RedirectToResources,
    label: 'QuickStarts for Red Hat OpenShift Application Services',
    path: '/streams/resources',
    title: 'QuickStarts for Red Hat OpenShift Application Services',
    devPreview: true,
  },
  {
    component: ResourcesPage,
    exact: true,
    label: 'Learning Resources | Red Hat OpenShift Application Services',
    path: '/learning-resources',
    title: 'Learning Resources | Red Hat OpenShift Application Services',
    devPreview: false,
  },
];

const WrappedRoute: React.FunctionComponent<IAppRoute<any>> = ({
  component: Component,
  isAsync = false,
  title,
  basename,
  devPreview,
  ...rest
}) => {
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

const AppRoutes = (): React.ReactElement => (
  <>
    <LastLocationProvider>
      <React.Suspense fallback={<AppServicesLoading />}>
        <Switch>
          {flattenedRoutes(appRoutes).map(({ path, exact, component, title, isAsync, ...rest }, idx) => (
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
          <PageNotFoundRoute title="404 Page Not Found" />
        </Switch>
      </React.Suspense>
    </LastLocationProvider>
    <QuickStartLoaderFederated />
  </>
);

export { AppRoutes, appRoutes };
