/*eslint no-console: ["error", { allow: ["error", "log"] }] */
import React from 'react';
import Entry from './Entry.js';
import ScaleUI from './ScaleUI';
import ReportGenerator from './ReportGenerator';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';

const App = () => (
  <Provider store={store}>
    <Switch>
      <Route exact path='/' component={Entry} />
      <Route exact path='/scaleUI' component={ScaleUI} />
      <Route exact path='/report' component={ReportGenerator} />
    </Switch>
  </Provider>
);

export default App;
