import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { AppRouteConfig, flattenedRoutes, IAppRoute, PageNotFoundRoute, useA11yRouteChange } from '@app/utils/Routing';
import { useDocumentTitle } from '@app/utils';
import { CreateTopic, TopicDetails, Topics, UpdateTopic, Dashboard, ConsumerGroups, AclPermissions } from '@app/pages';
import { UnderlyingProps } from '@app/pages/Kafka/KafkaFederatedComponent';
import { BasenameContext } from '@rhoas/app-services-ui-shared';

const kafkaRoutes: AppRouteConfig<UnderlyingProps>[] = [
  {
    component: Topics,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/topics',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    devPreview: true,
  },
  {
    component: TopicDetails,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/topics/:topicName',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    devPreview: true,
  },
  {
    component: CreateTopic,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/topic/create',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    devPreview: true,
  },
  {
    component: UpdateTopic,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/topic/update/:topicName',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    devPreview: true,
  },
  {
    component: Dashboard,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    devPreview: true,
  },
  {
    component: Dashboard,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/dashboard',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    devPreview: true,
  },
  {
    component: ConsumerGroups,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/consumer-groups',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    devPreview: true,
  },
  {
    component: AclPermissions,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/acls',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    devPreview: true,
  },
];

type WrappedRouteProps = IAppRoute<UnderlyingProps> & {
  underlyingProps: UnderlyingProps;
  url: string;
};

/**
 * The wrapped route allows us to apply the basename, document title and accessible route change for all components
 * without having to add these to each component. They must happen inside the route.
 */
const WrappedRoute: React.FunctionComponent<WrappedRouteProps> = ({
  component: Component,
  isAsync = false,
  title,
  underlyingProps,
  url,
  ...rest
}) => {
  useA11yRouteChange(isAsync);
  useDocumentTitle(title);

  const getBasename = () => {
    return url;
  };

  return (
    <Route
      render={(routeProps) => {
        return (
          <BasenameContext.Provider value={{ getBasename }}>
            <Component {...underlyingProps} {...rest} {...routeProps} />
          </BasenameContext.Provider>
        );
      }}
      {...rest}
    />
  );
};

const KafkaRoutes = (props): React.ReactElement => {
  const routeMatch = useRouteMatch();
  return (
    <Switch>
      {flattenedRoutes(kafkaRoutes).map(({ path, exact, component, title, isAsync, ...rest }, idx) => {
        const routePath = `${routeMatch.path}${path}`;
        console.log(`Creating route for ${routePath}`);
        return (
          <WrappedRoute
            path={routePath}
            exact={exact}
            component={component}
            key={idx}
            title={title}
            isAsync={isAsync}
            underlyingProps={props}
            url={routeMatch.url}
            {...rest}
          />
        );
      })}
      <PageNotFoundRoute title="404 Page Not Found" />
    </Switch>
  );
};

export { KafkaRoutes, kafkaRoutes };
