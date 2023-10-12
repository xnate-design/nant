import { resolve, join } from 'path';
import { getDirname } from './fsUtils.js';

export const ROOT = process.cwd();

export const dirname = getDirname(import.meta.url);
console.log(dirname, 'dirname');

export const CLIENT_PATH = resolve(dirname, '../../../', 'client');
export const NODE_PATH = resolve(dirname, '../../', 'node');

export const DOC_ROOT = join(dirname, '../../../../', 'site');
export const SITE_ROOT = resolve(ROOT, '.');
export const SITE_PUBLIC_PATH = resolve(ROOT, 'public');
export const SITE_OUTPUT_PATH = resolve(ROOT, 'dist');

export const INIT_DIR = resolve(dirname, '../../../../template');
export const CONFIG_PATH = resolve(process.cwd(), '.nant/config.mts');
export const VITE_CONFIG_PATH = resolve(NODE_PATH, '/config/viteConfig.js');
export const UNOCSS_CONFIG_PATH = resolve(NODE_PATH, '/config/unocssConfig.js');

export const APPEARANCE_KEY = 'nant-theme';
export const DEFAULT_THEME_DIR = resolve(CLIENT_PATH, 'theme-default');

export const CLI_PACKAGE_JSON = resolve(dirname, '../../../../package.json');
