/*global module*/

const SECTION = 'application-services';
const FRONTEND_PORT = 8002;
const routes = {};

routes[`/beta/${SECTION}`] = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/${SECTION}`]      = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/beta/apps/${SECTION}`]       = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/apps/${SECTION}`]            = { host: `https://localhost:${FRONTEND_PORT}` };

module.exports = { routes };
