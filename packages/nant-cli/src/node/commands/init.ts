import fse from 'fs-extra';
import path from 'path';
import logger from '../shared/logger';
import url from 'url';
import po from 'picocolors';

// import { tempate } from 'lodash-es';
import { intro, outro, group, text, select, cancel, confirm } from '@clack/prompts';
import { INIT_DIR } from '../shared/constant.js';
import { log } from 'console';

const { copy } = fse;
const { black, cyan, bgCyan, bold, yellow } = po;

export interface ScaffoldOptions {
  root?: string;
  title?: string;
  description?: string;
  theme?: string;
  useTs?: boolean;
}

export async function init() {
  intro(bgCyan(bold(black('📦📦 Welcome to use nant cli generate application !'))));

  const options: ScaffoldOptions = await group(
    {
      root: () =>
        text({
          message: 'Where should initialize the config ?',
          initialValue: './',
        }),
      title: () =>
        text({
          message: 'Site name',
          initialValue: 'My Nant Site',
          placeholder: 'My Nant Site',
        }),
      description: () =>
        text({
          message: 'Site description',
          initialValue: 'nant ui site',
          placeholder: 'nant ui site',
        }),
    },
    {
      onCancel: () => {
        cancel('Cancelled');
        process.exit(0);
      },
    },
  );

  const msg = await scaffoldInit(options);

  outro(msg);

  console.log(options);
}

export async function scaffoldInit(options: ScaffoldOptions) {
  const { root = './', title = 'My Nant Site', description = 'nant ui site' } = options;

  const destPath = path.resolve(root);
  const tmpDIr = path.resolve(INIT_DIR);

  console.log(destPath, 'destPath');
  console.log(tmpDIr, 'tmpDIr');

  await copy(tmpDIr, destPath);

  return 'init successfully';
}
