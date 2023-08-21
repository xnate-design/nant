import { createServer as createViteServer, ViteDevServer } from 'vite';
import fse from 'fs-extra';
import chokidar, { FSWatcher } from 'chokidar';

import { resolveConfig } from '../config/index.js';
import { createVitePlugins } from '../plugins/index.js';
import { resolveInlineConfig } from '../config/viteConfig.js';
import { CONFIG_PATH } from '../shared/constant.js';
interface DevCommandOptions {
  force?: boolean;
}

const { ensureDirSync, pathExistsSync } = fse;

let server: ViteDevServer;
// let watcher:
let watcher: FSWatcher;

export async function dev(options?: DevCommandOptions) {
  // 1. resolve config
  // 2. createViteServer

  const isRestart = Boolean(server);

  server = await createServer();
  await server.listen();
  server.printUrls();
}

async function startServer() {
  server && (await server.close());
  watcher && (await watcher.close());

  const config = await resolveConfig();
  const plugins = await createVitePlugins(config);
  const inlineConfig = resolveInlineConfig(config);

  server = await createViteServer(inlineConfig);
  await server.listen();
  server.printUrls();

  console.log(CONFIG_PATH, 'CONFIG_PATH');

  if (pathExistsSync(CONFIG_PATH)) {
    console.log('pathExistsSync');

    watcher = chokidar.watch(CONFIG_PATH);
    watcher.on('change', () => startServer());
  }
}

async function createServer() {
  const config = await resolveConfig();
  const plugins = await createVitePlugins(config);
  const inlineConfig = resolveInlineConfig(config);

  // return createViteServer(inlineConfig);
  return createViteServer({
    root: config.srcDir,
    base: config.site?.base,
    cacheDir: config.cacheDir,
    customLogger: config.logger,
    configFile: config.vite?.configFile,
    server: {},
    plugins,
  });
}
