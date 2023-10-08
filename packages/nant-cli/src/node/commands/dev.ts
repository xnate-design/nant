import { createServer as createViteServer, createLogger } from 'vite';
import c from 'picocolors';
import { getNantConfig } from '../config/index.js';

import { getDevConfig } from '../config/viteConfig.js';
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
  const nantConfig = await getNantConfig();
  const inlineConfig = await getDevConfig(nantConfig, recreateServer);

  return createViteServer(inlineConfig);
}
