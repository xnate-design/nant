import { createServer as createViteServer, ViteDevServer } from 'vite';

import { resolveConfig } from '../config/index.js';
import { createVitePlugins } from '../plugins/index.js';

interface DevCommandOptions {
  force?: boolean;
}

let server: ViteDevServer;
// let watcher:

export async function dev(options?: DevCommandOptions) {
  // 1. resolve config
  // 2. createViteServer

  const isRestart = Boolean(server);
  server = await createServer();
  await server.listen();
  server.printUrls();
}

async function createServer() {
  const config = await resolveConfig();
  const plugins = await createVitePlugins(config);
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
