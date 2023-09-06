import react from '@vitejs/plugin-react';
import Inspect from 'vite-plugin-inspect';
import path from 'path';
import UnoCSS from 'unocss/vite';
import unocssConfig from '../config/unoConfig.js';
import logger from '../shared/logger.js';

import { mergeConfig, searchForWorkspaceRoot } from 'vite';
import { SiteConfig } from './../config/siteConfig.js';
import { resolveAliases, DIST_CLIENT_PATH, APP_PATH, SITE_DATA_REQUEST_PATH } from '../config/alias.js';
import { compilePage } from '../compiler/compilePage.js';
import { deserializeFunctions, serializeFunctions } from '../shared/serialize.js';
import { nantMdx } from '@nant/vite-plugins';
import { resolveUserConfig } from '../config/index.js';

import type { Plugin, PluginOption, ResolvedConfig, UserConfig } from 'vite';

declare module 'vite' {
  interface UserConfig {
    nant?: SiteConfig;
  }
}

const cleanUrl = (url: string): string => url.replace(/#.*$/s, '').replace(/\?.*$/s, '');

export const createVitePlugins = async (
  siteConfig: SiteConfig,
  recreateServer?: () => Promise<void>,
): Promise<PluginOption[]> => {
  const { srcDir, configPath, configDeps, site, vite: userViteConfig, pages } = siteConfig;

  const siteData = site;
  let config: ResolvedConfig;

  const nantPlugin: Plugin = {
    name: 'nant',

    resolveId(id) {
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
    config() {
      const baseConfig: UserConfig = {
        resolve: {
          alias: resolveAliases(siteConfig),
        },
        optimizeDeps: {
          include: ['react/jsx-runtime'],
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
      config = resolvedConfig;
    },

    // vite hook self - configureServer
    configureServer(server) {
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
    <title>${site.title}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="description" content="${site.description}">
    <script>
      (function () {
        function setTheme(newTheme) {
          window.__theme = newTheme;
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else if (newTheme === 'light') {
            document.documentElement.classList.remove('dark');
          }
        }

        var preferredTheme;
        try {
          preferredTheme = localStorage.getItem('theme');
        } catch (err) { }

        window.__setPreferredTheme = function(newTheme) {
          preferredTheme = newTheme;
          setTheme(newTheme);
          try {
            localStorage.setItem('theme', newTheme);
          } catch (err) { }
        };

        var initialTheme = preferredTheme;
        var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

        if (!initialTheme) {
          initialTheme = darkQuery.matches ? 'dark' : 'light';
        }
        setTheme(initialTheme);

        darkQuery.addEventListener('change', function (e) {
          if (!preferredTheme) {
            setTheme(e.matches ? 'dark' : 'light');
          }
        });

        // Detect whether the browser is Mac to display platform specific content
        // An example of such content can be the keyboard shortcut displayed in the search bar
        document.documentElement.classList.add(
            window.navigator.platform.includes('Mac')
            ? "platform-mac"
            : "platform-win"
        );
      })();
    </script>
  </head>
  <body class="antialiased min-h-screen w-full text-base bg-wash dark:bg-wash-dark text-primary dark:text-primary-dark">
    <div id="root"></div>
    <script type="module" src="/@fs/${DIST_CLIENT_PATH}/main.jsx"></script>
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

    async handleHotUpdate(ctx) {
      const { file } = ctx;
      if (file === configPath || configDeps.includes(file)) {
        siteConfig.logger.info(logger.green(`${path.relative(process.cwd(), file)} changed, restarting server...\n`), {
          clear: true,
          timestamp: true,
        });

        try {
          await resolveUserConfig(siteConfig.root, 'serve', 'development');
        } catch (err: any) {
          return;
        }

        await recreateServer?.();
        return;
      }
    },
  };

  return [
    nantPlugin,
    nantMdx({ development: true }),
    react({
      include: /\.(mdx|md|js|jsx|ts|tsx)$/,
    }),
    Inspect(),
    UnoCSS(unocssConfig),
  ];
};
