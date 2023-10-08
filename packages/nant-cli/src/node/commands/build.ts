import fse from 'fs-extra';
import { build as buildVite } from 'vite';

import { getNantConfig } from '../config/index.js';
import { getBuildConfig } from '../config/viteConfig.js';

const { ensureDirSync } = fse;

export async function build() {
  process.env.NODE_ENV = 'production';

  const nantConfig = await getNantConfig();
  const buildConfig = getBuildConfig(nantConfig);

  await buildVite(buildConfig);
}
