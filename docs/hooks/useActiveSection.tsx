export const useActiveSection = (pathname: string) => {
  const cleanedPath = pathname.split(/[?#]/)[0];

  const regPath = /\/(.*?)\//g; // match /react/
  const regex = /\/([^/]+)\//; // match /react/ and react

  const [, s] = cleanedPath.match(regex) || [];

  if (cleanedPath === '/') return 'home';

  if (cleanedPath.startsWith(`/${s}`)) return `/${s}`;

  return 'unknown';
};
