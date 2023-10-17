import React from 'react';
import ReactDOM from 'react-dom/client';

import { SiteMobileTheme, SiteContext } from '@nant-design/theme-default';
import siteData from '@siteData';

export const initData = () => {
  return {
    site: siteData,
    themeConfig: siteData.themeConfig,
    nav: siteData.themeConfig.nav,
    sideBar: siteData.themeConfig.sidebar,
  };
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('app')!;
const root = ReactDOM.createRoot(container);

const configContext = initData();

const App = (
  <SiteContext.Provider value={configContext}>
    <SiteMobileTheme />
  </SiteContext.Provider>
);

root.render(App);
