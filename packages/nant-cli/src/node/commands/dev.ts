import { createServer as createViteServer, createLogger, ViteDevServer } from 'vite';
import c from 'picocolors';
import chokidar, { FSWatcher } from 'chokidar';
import { getNantConfig } from '../config/index.js';
import { getDevConfig } from '../config/viteConfig.js';
import { bindShortcuts } from '../utils/shortcuts.js';
import { getCliVersion } from '../shared/fsUtils.js';
import { CONFIG_PATH, UNOCSS_CONFIG_PATH, VITE_CONFIG_PATH } from '../shared/constant.js';

const watchesConfig = [CONFIG_PATH, VITE_CONFIG_PATH, UNOCSS_CONFIG_PATH];

const logVersion = (logger = createLogger()) => {
  logger.info(`\n  ${c.green(`${c.bold('nant')} v${getCliVersion()}`)}\n`, {
    clear: !logger.hasWarned,
  });
};

export async function dev() {
  process.env.NODE_ENV = 'development';

  let server: ViteDevServer;
  let watch: FSWatcher;

  const createDevServer = async () => {
    watch && watch.close();
    server && server.close();

    server = await createServer();
    await server.listen();

    logVersion(server.config.logger);
    server.printUrls();
    bindShortcuts(server, createDevServer);

    watch = chokidar.watch(watchesConfig);
    watch.on('change', () => createDevServer());
  };

  createDevServer().catch((err) => {
    createLogger().error(`${c.red(`failed to start server. error:`)}\n${err.stack}`);
    process.exit(1);
  });
}

async function createServer(recreateServer?: () => Promise<void>) {
  const nantConfig = await getNantConfig();
  const inlineConfig = await getDevConfig(nantConfig, recreateServer);

  return createViteServer(inlineConfig);
}
