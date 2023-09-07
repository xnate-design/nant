import { createContext } from 'react';

import siteData from '@siteData';
import { DefaultTheme } from 'nant/theme';

// import { SiteData } from '';

export const initData = (): NantData => {
  return {
    site: siteData,
    theme: siteData.themeConfig,
    nav: siteData.themeConfig.nav,
    sideBar: siteData.themeConfig.sidebar,
  };
};

export interface NantData<T = any> {
  site?: any;
  theme?: T;
  nav?: DefaultTheme.NavItem[];
  sideBar?: DefaultTheme.SideBar;
  title?: string;
}

export default createContext<NantData>({});
