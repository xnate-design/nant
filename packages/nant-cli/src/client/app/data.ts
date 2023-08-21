import siteData from '@siteData';
import type { PageData, SiteData } from '../shared';

export const initData = () => {
  console.log(siteData, 'siteData');

  const routes = [];
  return siteData;
};

// hmr
// if (import.meta.hot) {
//   import.meta.hot.accept('/@siteData', (m) => {
//     if (m) {
//     }
//   });
// }

export interface NantData<T = any> {
  site: SiteData<T>;
  theme: T;
  page: PageData;
  frontmatter: PageData['frontmatter'];
  params: PageData['params'];
  title: string;
  lang: string;
  isDark: boolean;
  dir: string;
  localeIndex: string;
}
