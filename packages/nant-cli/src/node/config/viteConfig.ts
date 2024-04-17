import { resolveAlias } from './alias.js';
import { createNantPlugins } from '../plugins/index.js';
import { DOC_ROOT, SITE_PUBLIC_PATH, SITE_OUTPUT_PATH } from '../shared/constant.js';
import type { NantConfig } from './siteConfig.js';
import type { InlineConfig } from 'vite';

import path from 'path';

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
          mobile: path.join(DOC_ROOT, 'mobile.html'),
        },
      },
    },
  };
};
