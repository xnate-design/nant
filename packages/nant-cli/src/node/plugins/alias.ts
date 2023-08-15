import { resolve, join } from 'path';
import { SiteConfig } from './../config/siteConfig';
import { fileURLToPath } from 'url';

import type { Alias, AliasOptions } from 'vite';

const PKG_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');

console.log(PKG_ROOT, 'PKG_ROOT');

export const DIST_CLIENT_PATH = resolve(PKG_ROOT, 'client');
export const APP_PATH = join(DIST_CLIENT_PATH, 'app');
export const SHARED_PATH = join(DIST_CLIENT_PATH, 'shared');
export const DEFAULT_THEME_PATH = join(DIST_CLIENT_PATH, 'theme-default');

export const resolveAliases = ({ root, themeDir }: SiteConfig): AliasOptions => {
  const paths: Record<string, string> = {
    '@theme': themeDir,
    '@siteData': '/@siteData',
  };

  const aliases: Alias[] = [
    ...Object.keys(paths).map((path) => ({
      find: path,
      replacement: paths[path],
    })),
    {
      find: /^nant$/,
      replacement: resolve(DIST_CLIENT_PATH, '/index.js'),
    },
    {
      find: /^nant\/theme$/,
      replacement: resolve(DIST_CLIENT_PATH, '/theme-default/index.js'),
    },
  ];

  return aliases;
};
