import react from '@vitejs/plugin-react';
import Inspect from 'vite-plugin-inspect';
import UnoCSS from 'unocss/vite';
import { html } from '@nant/vite-plugins';
import { resolveAliases, APP_PATH } from './alias.js';
import { mdxPlugin } from '../plugins/markdown.js';

import { get } from 'lodash-es';

import type { RawConfigExports, UserConfig, SiteConfig } from './siteConfig.js';

import type { InlineConfig, Plugin } from 'vite';

export const resolveInlineConfig = (config: SiteConfig): InlineConfig => {
  const { root, site, cacheDir, logger: customLogger, vite } = config;

  const { title, description } = site;

  const resolve = {
    alias: resolveAliases(config),
  };

  const optimizeDeps = {
    include: ['react/jsx-runtime'],
  };

  const server = {
    port: 4001,
    host: 'localhost',
    hmr: true,
  };

  const injectHtmlData = {
    data: {
      entry: `${APP_PATH}/index.jsx`,
      title,
      description,
    },
  };

  return {
    root,
    customLogger,
    // cacheDir,
    resolve,
    optimizeDeps,
    server,
    plugins: [react(), html(injectHtmlData), Inspect(), UnoCSS()],
    base: site?.base,
    configFile: vite?.configFile,
  };
};
