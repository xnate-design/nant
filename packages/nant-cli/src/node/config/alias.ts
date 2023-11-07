import { resolve, join } from 'path';
import { SiteConfig } from './../config/siteConfig';
import { fileURLToPath } from 'url';

import type { Alias, AliasOptions } from 'vite';
import { SITE_MOBILE_ROUTES, SITE_PC_ROUTES, SITE_PUBLIC_PATH } from '../shared/constant.js';

const PKG_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');

export const DIST_CLIENT_PATH = resolve(PKG_ROOT, 'client');

export const APP_PATH = join(DIST_CLIENT_PATH, 'app');
export const SHARED_PATH = join(DIST_CLIENT_PATH, 'shared');
export const DEFAULT_THEME_PATH = join(DIST_CLIENT_PATH, 'theme-default');

// special virtual file. we can't directly import '/@siteData' because
// - it's not an actual file so we can't use tsconfig paths to redirect it
// - TS doesn't allow shimming a module that starts with '/'

export const SITE_DATA_ID = '@siteData';
export const SITE_DATA_REQUEST_PATH = '/' + SITE_DATA_ID;

export const resolveAliases = ({ root, themeDir }: SiteConfig): AliasOptions => {
  const paths: Record<string, string> = {
    '@theme': themeDir,
    [SITE_DATA_ID]: SITE_DATA_REQUEST_PATH,
  };

  const aliases: Alias[] = [
    ...Object.keys(paths).map((path) => ({
      find: path,
      replacement: paths[path],
    })),
    {
      find: /^nant\/share$/,
      replacement: join(DIST_CLIENT_PATH, '/share.js'),
    },
    {
      find: /^nant$/,
      replacement: join(DIST_CLIENT_PATH, '/index.js'),
    },
    {
      find: /^nant\/theme$/,
      replacement: join(DIST_CLIENT_PATH, '/theme-default/index.js'),
    },
  ];

  return aliases;
};

export const resolveAlias = (): AliasOptions => {
  const paths: Record<string, string> = {
    [SITE_DATA_ID]: SITE_DATA_REQUEST_PATH,
  };

  const aliases: Alias[] = [
    ...Object.keys(paths).map((path) => ({
      find: path,
      replacement: paths[path],
    })),
    {
      find: /^@pcRoute$/,
      replacement: SITE_PC_ROUTES,
    },
    {
      find: /^@mobileRoute$/,
      replacement: SITE_MOBILE_ROUTES,
    },
    {
      find: /^nant$/,
      replacement: join(DIST_CLIENT_PATH, '/index.js'),
    },
  ];

  return aliases;
};
