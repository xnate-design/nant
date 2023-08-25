import { createServer as createViteServer, createLogger } from 'vite';
import c from 'picocolors';
import { resolveConfig } from '../config/index.js';
import { createVitePlugins } from '../plugins/index.js';
import { bindShortcuts } from '../utils/shortcuts.js';
import { getCliVersion } from '../shared/fsUtils.js';

const logVersion = (logger = createLogger()) => {
  logger.info(`\n  ${c.green(`${c.bold('nant')} v${getCliVersion()}`)}\n`, {
    clear: !logger.hasWarned,
  });
};

export async function dev() {
  process.env.NODE_ENV = 'development';

  const createDevServer = async () => {
    const server = await createServer(async () => {
      await server.close();
      await createDevServer();
    });
    await server.listen();
    logVersion(server.config.logger);
    server.printUrls();
    bindShortcuts(server, createDevServer);
  };

  createDevServer().catch((err) => {
    createLogger().error(`${c.red(`failed to start server. error:`)}\n${err.stack}`);
    process.exit(1);
  });
}

async function createServer(recreateServer?: () => Promise<void>) {
  const config = await resolveConfig();
  const plugins = await createVitePlugins(config, recreateServer);

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
