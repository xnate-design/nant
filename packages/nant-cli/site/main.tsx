import React from 'react';
import ReactDOM from 'react-dom/client';

import { SiteTheme, SiteContext } from '@nant-design/theme-default';
import siteData from '@siteData';

// import { initData } from 'nant';

export const initData = () => {
  return {
    site: siteData,
    themeConfig: siteData.themeConfig,
    nav: siteData.themeConfig.nav,
    sideBar: siteData.themeConfig.sidebar,
  };
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);
const configContext = initData();

console.log(configContext, 'configContext');

const App = (
  <SiteContext.Provider value={configContext}>
    <SiteTheme />
  </SiteContext.Provider>
);

root.render(App);
