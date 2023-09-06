import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';

import { SiteTheme, SiteContext } from '@nant/theme-default';
import { initData } from './data';

import 'virtual:uno.css';
import '@unocss/reset/tailwind.css';

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
