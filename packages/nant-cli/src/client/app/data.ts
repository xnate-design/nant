import siteData from '@siteData';
import type { PageData, SiteData, DefaultTheme } from '../shared';

export const initData = (): NantData => {
  return {
    site: siteData.site,
    theme: siteData.site.themeConfig,
    nav: siteData.site.themeConfig.nav,
    sideBar: siteData.site.themeConfig.sidebar,
  };
};

export interface NantData<T = any> {
  site?: SiteData<T>;
  theme?: T;
  nav?: DefaultTheme.NavItem[];
  sideBar?: DefaultTheme.SideBar;
  page?: PageData;
  frontmatter?: PageData['frontmatter'];
  params?: PageData['params'];
  title?: string;
  lang?: string;
  isDark?: boolean;
  dir?: string;
  localeIndex?: string;
}
