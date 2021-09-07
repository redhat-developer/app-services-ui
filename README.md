[![Build Status](https://travis-ci.org/RedHatInsights/insights-frontend-starter-app.svg?branch=master)](https://travis-ci.org/RedHatInsights/insights-frontend-starter-app)

# mk-ui

mk-ui is based on the https://github.com/RedHatInsights/insights-frontend-starter-app.git which is React.js starter app for Red Hat Insights products that includes Patternfly 4 and shared cloud.redhat.com utilities.

## Running the Control Plane UI inside the host locally
`
1. Follow the [Control Plane UI Readme](https://github.com/bf2fc6cc711aee1a0c2a/mk-ui-frontend) to start the development server
2. Once you have the development server running successfully, shut it down, and run `npm run start:federate` instead
3. Clone the [Data UI Readme](https://github.com/bf2fc6cc711aee1a0c2a/kafka-ui), then follow the instructions to install and start the client in development mode.
4. Clone the guides repo [Managed Kafka Guides](https://github.com/bf2fc6cc711aee1a0c2a/guides), then follow the instructions under .build to install and start the guides.
5. Clone [insights-proxy](https://github.com/RedHatInsights/insights-proxy)
6. First time around, you need to follow the [setup guide for insights-proxy](https://github.com/RedHatInsights/insights-proxy#setup)
6. Run `export PROXY_PATH=<path to local insights proxy clone>`
7. In this project, run `SPANDX_CONFIG="./profiles/local-frontend.js" bash $PROXY_PATH/scripts/run.sh`
8. In this project, run `npm install`
9. In this project, run `npm run start:dev`
10. Visit https://prod.foo.redhat.com:1337/beta/application-services/streams/kafkas.__
