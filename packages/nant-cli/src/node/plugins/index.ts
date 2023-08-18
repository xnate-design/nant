import react from '@vitejs/plugin-react';
import Inspect from 'vite-plugin-inspect';
import UnoCSS from 'unocss/vite';

import { mergeConfig, searchForWorkspaceRoot } from 'vite';
import { SiteConfig } from './../config/siteConfig.js';
import { resolveAliases, DIST_CLIENT_PATH, APP_PATH, SITE_DATA_REQUEST_PATH } from './alias.js';
import { compilePage } from '../compiler/compilePage.js';
import { deserializeFunctions, serializeFunctions } from '../shared/serialize.js';
import { mdxPlugin } from './markdown.js';
import { babel } from '@rollup/plugin-babel';

import type { Plugin, ResolvedConfig, Rollup, UserConfig } from 'vite';

declare module 'vite' {
  interface UserConfig {
    nant?: SiteConfig;
  }
}

const cleanUrl = (url: string): string => url.replace(/#.*$/s, '').replace(/\?.*$/s, '');

export const createVitePlugins = async (siteConfig: SiteConfig) => {
  const {
    srcDir,
    configPath,
    configDeps,
    markdown,
    site,
    vite: userViteConfig,
    pages,
    lastUpdated,
    cleanUrls,
  } = siteConfig;

  const siteData = site;
  let config: ResolvedConfig;

  const nantPlugin: Plugin = {
    name: 'nant',

    options(option) {
      // console.log('options', option);
    },

    buildStart(option) {
      // console.log('buildStart', option);
    },

    resolveId(id) {
      // console.log('resolveId', id);
      if (id === SITE_DATA_REQUEST_PATH) return SITE_DATA_REQUEST_PATH;
    },

    load(id) {
      if (id === SITE_DATA_REQUEST_PATH) {
        let data = config.nant;

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
    config(config) {
      // console.log(config, 'config');

      const baseConfig: UserConfig = {
        resolve: {
          alias: resolveAliases(siteConfig),
        },
        server: {
          fs: {
            allow: [DIST_CLIENT_PATH, srcDir, searchForWorkspaceRoot(process.cwd())],
          },
        },
        nant: siteConfig,
      };
      return userViteConfig ? mergeConfig(baseConfig, userViteConfig) : baseConfig;
    },

    // vite hook self - configResolved
    configResolved(resolvedConfig) {
      // console.log(resolvedConfig, 'configResolved');
      config = resolvedConfig;
    },

    // vite hook self - configureServer
    configureServer(server) {
      // console.log(server, 'configureServer');

      if (configPath) {
        server.watcher.add(configPath);
        configDeps.forEach((file) => server.watcher.add(file));
      }

      // update pages, dynamicRoutes and rewrites on md file add / deletion
      const onFileAddDelete = async (file: string) => {
        if (file.endsWith('.md')) {
          Object.assign(siteConfig, await compilePage(siteConfig.srcDir, siteConfig.userConfig));
        }
      };
      server.watcher.on('add', onFileAddDelete).on('unlink', onFileAddDelete);

      return () => {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url && cleanUrl(req.url);
          if (url?.endsWith('.html')) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            let html = `<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="description" content="">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/@fs/${APP_PATH}/index.jsx"></script>
  </body>
</html>
            `;
            html = await server.transformIndexHtml(url, html, req.originalUrl);
            res.end(html);
            return;
          }
          next();
        });
      };
    },

    transformIndexHtml(html) {
      // console.log(html, 'transformIndexHtml');
    },

    handleHotUpdate(ctx) {
      // console.log(ctx, 'handleHotUpdate');
    },
  };
  return [
    Inspect(),
    nantPlugin,
    mdxPlugin(),
    UnoCSS(),
    react(),
    babel({
      // Also run on what used to be `.mdx` (but is now JS):
      extensions: ['.js', '.tsx', '.jsx', '.cjs', '.mjs', '.md', '.mdx'],
      // Other options…
    }),
  ];
};
