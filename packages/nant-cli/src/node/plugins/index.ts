import react from '@vitejs/plugin-react';
import Inspect from 'vite-plugin-inspect';
import path from 'path';
import UnoCSS from 'unocss/vite';
import unocssConfig from '../config/unoConfig.js';
import logger from '../shared/logger.js';

import { createLogger, searchForWorkspaceRoot } from 'vite';
import { SITE_ROOT, CONFIG_PATH, UNOCSS_CONFIG_PATH, VITE_CONFIG_PATH } from '../shared/constant.js';
import { NantConfig } from './../config/siteConfig.js';
import { DIST_CLIENT_PATH, SITE_DATA_REQUEST_PATH, resolveAlias } from '../config/alias.js';
import { deserializeFunctions, serializeFunctions } from '../shared/serialize.js';
import { nantMdx, html } from '@nant-design/vite-plugins';

import type { Plugin, PluginOption, ResolvedConfig, UserConfig } from 'vite';

declare module 'vite' {
  interface UserConfig {
    nant?: NantConfig;
  }
}

const cleanUrl = (url: string): string => url.replace(/#.*$/s, '').replace(/\?.*$/s, '');

/**
 * create nant custom vite plugin
 * @param nantConfig
 * @param recreateServer
 * @returns
 */
export const createNantPlugins = async (
  nantConfig: NantConfig,
  recreateServer?: () => Promise<void>,
): Promise<PluginOption[]> => {
  const { title, description } = nantConfig;

  const siteData = nantConfig;

  const viteLogger = createLogger(undefined, {
    prefix: '[nant]',
    allowClearScreen: false,
  });

  const watchesConfig = [CONFIG_PATH, VITE_CONFIG_PATH, UNOCSS_CONFIG_PATH];

  let config: ResolvedConfig;

  const nantPlugin: Plugin = {
    name: 'nant',

    resolveId(id) {
      if (id === SITE_DATA_REQUEST_PATH) return SITE_DATA_REQUEST_PATH;
    },

    load(id) {
      if (id === SITE_DATA_REQUEST_PATH) {
        let data = siteData;

        if (config.command === 'build') {
          console.log('build');
        }
        data = serializeFunctions(data);
        return `${deserializeFunctions};export default deserializeFunctions(JSON.parse(${JSON.stringify(
          JSON.stringify(data),
        )}))`;
      }
    },

    // vite hook self - config
    config() {
      const baseConfig: UserConfig = {
        resolve: {
          alias: resolveAlias(),
        },
        optimizeDeps: {
          include: ['react/jsx-runtime'],
        },
        server: {
          fs: {
            allow: [DIST_CLIENT_PATH, SITE_ROOT, searchForWorkspaceRoot(process.cwd())],
          },
        },
        nant: nantConfig,
      };
      return baseConfig;
    },

    // vite hook self - configResolved
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    async handleHotUpdate(ctx) {
      const { file } = ctx;
      console.log(file, 'hot update');

      if (file === CONFIG_PATH || watchesConfig.includes(file)) {
        viteLogger.info(logger.green(`${path.relative(process.cwd(), file)} changed, restarting server...\n`), {
          clear: true,
          timestamp: true,
        });

        await recreateServer?.();
        return;
      }
    },
  };

  const isPro = process.env.NODE_ENV === 'production';

  return [
    nantPlugin,
    nantMdx({ development: !isPro }),
    react({
      include: /\.(mdx|md|js|jsx|ts|tsx)$/,
    }),
    html({
      data: {
        title: siteData.title ?? '',
        description: siteData.description ?? '',
      },
    }),
    Inspect(),
    UnoCSS(unocssConfig),
  ];
};
