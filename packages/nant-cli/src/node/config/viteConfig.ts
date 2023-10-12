import react from '@vitejs/plugin-react';
import Inspect from 'vite-plugin-inspect';
import UnoCSS from 'unocss/vite';
import { resolveAliases, resolveAlias, APP_PATH } from './alias.js';
import { createNantPlugins } from '../plugins/index.js';
import { get } from 'lodash-es';

import { DOC_ROOT, SITE_ROOT, SITE_PUBLIC_PATH, SITE_OUTPUT_PATH, CLIENT_PATH } from '../shared/constant.js';

import type { RawConfigExports, UserConfig, SiteConfig, NantConfig } from './siteConfig.js';

import type { InlineConfig, Plugin } from 'vite';
import path from 'path';

console.log(process.cwd(), 'DOC_ROOT1');

console.log(path.join(DOC_ROOT, 'index.html'), 'DOC_ROOT');

console.log(SITE_PUBLIC_PATH, 'SITE_PUBLIC_PATH');

export const getDevConfig = async (
  nantConfig: NantConfig,
  recreateServer?: () => Promise<void>,
): Promise<InlineConfig> => {
  const plugins = await createNantPlugins(nantConfig, recreateServer);

  return {
    base: './',
    root: DOC_ROOT,
    resolve: {
      alias: resolveAlias(),
    },
    server: {
      port: 5001,
      host: 'localhost',
      open: true,
    },

    publicDir: SITE_PUBLIC_PATH,

    plugins,
  };
};

export const getBuildConfig = async (nantConfig: NantConfig): Promise<InlineConfig> => {
  const devConfig = await getDevConfig(nantConfig);

  console.log(devConfig, 'devConfig');

  return {
    ...devConfig,

    base: '/',

    build: {
      outDir: SITE_OUTPUT_PATH,
      reportCompressedSize: false,
      emptyOutDir: true,
      cssTarget: 'chrome61',
      sourcemap: true,
      rollupOptions: {
        // external: ['virtual:uno.css'],
        input: {
          main: path.join(DOC_ROOT, 'index.html'),
        },
      },
    },
  };
};
