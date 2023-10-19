import siteDate from '@siteData';
import { useActiveSection } from './useActiveSection';
import { useLocation } from 'react-router-dom';

export const useFlatSideBar = (cleanedPath: string) => {
  const {
    themeConfig: { sidebar = {} },
  } = siteDate;
  const sideBarGroup = sidebar[cleanedPath] ?? [];

  return sideBarGroup.reduce((prev = [], curr: any) => {
    if (curr.items) {
      return prev.concat(curr.items);
    }
    return prev;
  }, []);
};

export const usePrevNext = () => {
  const { pathname } = useLocation();
  const cleanedPath = useActiveSection();
  const allRoutes = useFlatSideBar(cleanedPath);
  const currIndex = allRoutes.findIndex((route: any) => route.link === pathname);

  const prev = allRoutes[currIndex - 1] ?? null;
  const next = allRoutes[currIndex + 1] ?? null;

  console.log(prev, next, 'allRoutes');

  return {
    prev,
    next,
  };
};
