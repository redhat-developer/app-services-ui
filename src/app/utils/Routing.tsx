import React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { accessibleRouteChangeHandler, useDocumentTitle } from '@app/utils';
import { useLastLocation } from 'react-router-last-location';

const NotFoundPage = React.lazy(() => import('@app/pages/NotFound/NotFoundPage'));

let routeFocusTimer: number;

export interface IAppRoute<T> {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  component: React.ComponentType<RouteComponentProps> | React.ComponentType<T>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  isAsync?: boolean;
  routes?: undefined;
  basename?: string;
  devPreview?: boolean;
}

export interface IAppRouteGroup<T> {
  label: string;
  routes: IAppRoute<T>[];
}

export type AppRouteConfig<T> = IAppRoute<T> | IAppRouteGroup<T>;


// a custom hook for sending focus to the primary content container
// after a view has loaded so that subsequent press of tab key
// sends focus directly to relevant content
export const useA11yRouteChange = (isAsync: boolean) => {
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

export const PageNotFoundRoute: React.FunctionComponent<{ title: string }> = ({ title }: { title: string }) => {
  useDocumentTitle(title);
  return <Route component={NotFoundPage}/>;
};

export const flattenedRoutes = <T, >(routes: AppRouteConfig<T>[]) => routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute<T>[]
);
