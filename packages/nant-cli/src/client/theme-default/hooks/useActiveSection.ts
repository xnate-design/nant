import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import SiteContext from '../SiteContext';

export const useActiveSection = () => {
  const { pathname } = useLocation();
  const cleanedPath = pathname.split(/[?#]/)[0];

  const regPath = /\/(.*?)\//g; // match /react/
  const regex = /\/([^/]+)\//; // match /react/ and react

  const [, s] = cleanedPath.match(regex) || [];

  if (cleanedPath === '/') return 'home';

  if (cleanedPath.startsWith(`/${s}`)) return s;

  return 'unknown';
};
