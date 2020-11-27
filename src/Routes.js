import { BrowserRouter, Redirect, Route, Switch, useLocation } from 'react-router-dom';

import PropTypes from 'prop-types';
import React from 'react';
import asyncComponent from './Utilities/asyncComponent';
import some from 'lodash/some';
import { routes as paths } from '../package.json';
import { ControlPlanePage } from './Routes/ControlPlanePage/ControlPlanePage';
import { DataPlanePage } from './Routes/DataPlanePage/DataPlanePage';

/**
 * Aysnc imports of components
 *
 * https://webpack.js.org/guides/code-splitting/
 * https://reactjs.org/docs/code-splitting.html
 *
 * pros:
 *      1) code splitting
 *      2) can be used in server-side rendering
 * cons:
 *      1) nameing chunk names adds unnecessary docs to code,
 *         see the difference with DashboardMap and InventoryDeployments.
 *
 */

const InsightsRoute = ({ component: Component, rootClass, ...rest }) => {
    const root = document.getElementById('root');
    root.removeAttribute('class');
    root.classList.add(`page__${rootClass}`, 'pf-c-page__main');
    root.setAttribute('role', 'main');

    return (<Route {...rest} component={Component} />);
};

InsightsRoute.propTypes = {
    component: PropTypes.func,
    rootClass: PropTypes.string
};

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/advisor/rules
 *      component - component to be rendered when a route has been chosen.
 */
export const Routes = () => {
    const path = useLocation().pathname;

    return (
        <Switch>
            <InsightsRoute path='/kafkas' component={() => <DataPlanePage />} />
            <InsightsRoute exact={true} path='/' component={() => <ControlPlanePage />} />
            <Route render={() => some(paths, p => p === path) ? null : (<Redirect to='/' />)} />
        </Switch>
    );
};

Routes.propTypes = {
    childProps: PropTypes.shape({
        history: PropTypes.shape({
            push: PropTypes.func
        })
    })
};
