import siteData from '@siteData';

import type { SiteData, DefaultTheme } from 'nant/shared';

console.log(siteData, 'siteData');

export const initData = (): NantData => {
  return {
    site: siteData,
    themeConfig: siteData.themeConfig,
    nav: siteData.themeConfig.nav,
    sideBar: siteData.themeConfig.sidebar,
  };
};

export interface NantData<T = any> {
  site?: SiteData<T>;
  themeConfig?: T;
  nav?: DefaultTheme.NavItem[];
  sideBar?: DefaultTheme.SideBar;
}
