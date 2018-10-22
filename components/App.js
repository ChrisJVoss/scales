/*eslint no-console: ["error", { allow: ["error", "log"] }] */
import React, { Component, Fragment } from 'react';
import Entry from './Entry.js';
import ScaleUI from './ScaleUI';
import { MemoryRouter, Route, Switch } from 'react-router-dom';

const App = () => (
  <Switch>
    <Route exact path='/' component={Entry} />
    <Route exact path='/scaleUI' component={ScaleUI} />
  </Switch>
);

export default App;
