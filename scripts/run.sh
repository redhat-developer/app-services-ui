export PROXY_PATH=`pwd`/modules/insights-proxy
SPANDX_CONFIG="./profiles/local-frontend.js" bash $PROXY_PATH/scripts/run.sh & npm run start:dev & wait

## TODO ask to run other projects automatically using npm workspace
