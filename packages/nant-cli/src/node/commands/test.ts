import jestModule from 'jest';
import type { Config } from 'jest';
import { ROOT, JEST_CONFIG } from '../shared/constant.js';
import logger from '../shared/logger.js';

type JestCommandOptions = {
  watch?: boolean;
  watchAll?: boolean;
  components?: boolean;
  clearCache?: boolean;
};

const { runCLI } = jestModule;

export const test = async (cmd: JestCommandOptions) => {
  process.env.NODE_ENV !== 'test';

  const jestConfig: any = {
    rootDir: ROOT,
    config: JEST_CONFIG,
    watch: cmd.watch,
    watchAll: cmd.watchAll,
    clearMocks: cmd.clearCache,
  };

  try {
    const response = await runCLI(jestConfig, [ROOT]);
    if (!response.results.success && !cmd.watch) {
      process.exit(1);
    }
  } catch (error: any) {
    logger.error(error.toString());
    process.exit(1);
  }
};
