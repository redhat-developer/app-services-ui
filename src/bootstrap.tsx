import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import {init} from '@app/store';
import App from '@app/App';
import logger from 'redux-logger';
import getBaseName from '@app/utils/getBaseName';
import {InsightsContext} from "@app/utils/insights";

ReactDOM.render(
  <Provider store={init(logger).getStore()}>
    <InsightsContext.Provider value={window["insights"]}>
      <Router basename={getBaseName(window.location.pathname)}>
        <App/>
      </Router>
    </InsightsContext.Provider>
  </Provider>, document.getElementById('root')
);
