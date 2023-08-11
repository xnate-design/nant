import fse from 'fs-extra';
import path from 'path';
import logger from '../shared/logger';
import url from 'url';
// import { tempate } from 'lodash-es';
import { intro, outro, group, text, select, cancel, confirm } from '@clack/prompts';
import po from 'picocolors';

const { black, cyan, bgCyan, bold, yellow } = po;

export interface ScaffoldOptions {
  root?: string;
  title?: string;
  description?: string;
  theme?: string;
  useTs?: boolean;
}

export async function init() {
  intro(bgCyan(bold(black('Welcome to Nant! '))));
}
