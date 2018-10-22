/*eslint no-console: ["error", { allow: ["error", "log"] }] */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { MemoryRouter } from 'react-router-dom';
ReactDOM.render(
  <MemoryRouter>
    <App />
  </MemoryRouter>,
  document.getElementById('root')
);
