import React from 'react';
import ReactDOM from 'react-dom/client';

import { SiteTheme, SiteContext } from '../theme-default/main.jsx';
import { initData } from './data.js';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);

const configContext = initData();

const App = (
  <SiteContext.Provider value={configContext}>
    <SiteTheme />
  </SiteContext.Provider>
);

root.render(App);
