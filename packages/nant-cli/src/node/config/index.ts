import fse from 'fs-extra';
import path from 'path';
import logger from '../shared/logger.js';
import { createLogger, loadConfigFromFile, mergeConfig as mergeViteConfig, normalizePath } from 'vite';
import { APPEARANCE_KEY, DEFAULT_THEME_DIR } from '../shared/constant.js';
import { compilePage } from '../compiler/compilePage.js';
import type { ConfigEnv } from 'vite';
import type { SiteData, HeadConfig, DefaultTheme } from '../../../types/shared';
import type { RawConfigExports, UserConfig, SiteConfig } from './siteConfig.js';

const supportConfigExts = ['js', 'ts', 'mjs', 'mts'];

const resolve = (root: string, file: string) => {
  return normalizePath(path.resolve(root, '.nant', file));
};

export function defineConfig(config: UserConfig<DefaultTheme.SiteConfig>) {
  return config;
}

async function resolveConfigExtends(config: RawConfigExports): Promise<UserConfig> {
  const resolved = await (typeof config === 'function' ? config() : config);
  if (resolved.extends) {
    const base = await resolveConfigExtends(resolved.extends);
    return mergeConfig(base, resolved);
  }
  return resolved;
}

function mergeConfig(a: UserConfig, b: UserConfig, isRoot = true) {
  const merged: Record<string, any> = { ...a };
  for (const key in b) {
    const value = b[key as keyof UserConfig];
    if (value == null) {
      continue;
    }
    const existing = merged[key];
    if (Array.isArray(existing) && Array.isArray(value)) {
      merged[key] = [...existing, ...value];
      continue;
    }
    if (isObject(existing) && isObject(value)) {
      if (isRoot && key === 'vite') {
        merged[key] = mergeViteConfig(existing, value);
      } else {
        merged[key] = mergeConfig(existing, value, false);
      }
      continue;
    }
    merged[key] = value;
  }
  return merged;
}

function isObject(value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function resolveSiteDataHead(userConfig?: UserConfig): HeadConfig[] {
  const head = userConfig?.head ?? [];

  // add inline script to apply dark mode, if user enables the feature.
  // this is required to prevent "flash" on initial page load.
  if (userConfig?.appearance ?? true) {
    // if appearance mode set to light or dark, default to the defined mode
    // in case the user didn't specify a preference - otherwise, default to auto
    const fallbackPreference = userConfig?.appearance !== true ? userConfig?.appearance ?? '' : 'auto';

    head.push([
      'script',
      { id: 'check-dark-light' },
      `
        ;(() => {
          const preference = localStorage.getItem('${APPEARANCE_KEY}') || '${fallbackPreference}'
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          if (!preference || preference === 'auto' ? prefersDark : preference === 'dark') {
            document.documentElement.classList.add('dark')
          }
        })()
      `,
    ]);
  }

  return head;
}

export async function resolveSiteData(
  root: string,
  userConfig?: UserConfig,
  command: 'serve' | 'build' = 'serve',
  mode = 'development',
): Promise<SiteData> {
  userConfig = userConfig || (await resolveUserConfig(root, command, mode))[0];

  return {
    lang: userConfig.lang || 'en-US',
    dir: userConfig.dir || 'ltr',
    title: userConfig.title || 'Nant',
    titleTemplate: userConfig.titleTemplate,
    description: userConfig.description || 'A Nant site',
    base: userConfig.base ? userConfig.base.replace(/([^/])$/, '$1/') : '/',
    head: resolveSiteDataHead(userConfig),
    appearance: userConfig.appearance ?? true,
    themeConfig: userConfig.themeConfig || {},
    locales: userConfig.locales || {},
    contentProps: userConfig.contentProps,
  };
}

export async function resolveUserConfig(
  root: string,
  command: 'serve' | 'build',
  mode: string,
): Promise<[UserConfig, string | undefined, string[]]> {
  const configList = supportConfigExts.flatMap((ext) => [
    resolve(root, `config/index.${ext}`),
    resolve(root, `config.${ext}`),
  ]);

  const configPath = configList.find(fse.pathExistsSync);
  let userConfig: RawConfigExports = {};
  let configDeps: string[] = [];

  if (!configPath) {
    logger.warning('no config file found');
  } else {
    const configExport = await loadConfigFromFile({ command, mode }, configPath, root);
    if (configExport) {
      userConfig = configExport.config;
      configDeps = configExport.dependencies.map((file) => normalizePath(file));
    }
  }
  return [await resolveConfigExtends(userConfig), configPath, configDeps];
}

export async function resolveConfig(
  root: string = process.cwd(),
  command: 'serve' | 'build' = 'serve',
  mode = 'development',
) {
  root = normalizePath(root);

  const [userConfig, configPath, configDeps] = await resolveUserConfig(root, command, mode);

  const logger =
    userConfig.vite?.customLogger ??
    createLogger(userConfig.vite?.logLevel, {
      prefix: '[nant]',
      allowClearScreen: userConfig.vite?.clearScreen,
    });

  const site = await resolveSiteData(root, userConfig);
  const srcDir = normalizePath(path.resolve(root, userConfig.srcDir || '.'));
  const assetsDir = userConfig.assetsDir ? userConfig.assetsDir.replace(/\//g, '') : 'assets';
  const outDir = userConfig.outDir ? normalizePath(path.resolve(root, userConfig.outDir)) : resolve(root, 'dist');
  const cacheDir = userConfig.cacheDir
    ? normalizePath(path.resolve(root, userConfig.cacheDir))
    : resolve(root, 'cache');

  // resolve theme path
  const useThemeDir = resolve(root, 'theme');
  const themeDir = (await fse.pathExists(useThemeDir)) ? useThemeDir : DEFAULT_THEME_DIR;

  const pages = await compilePage(srcDir, userConfig);

  const config: SiteConfig = {
    root,
    srcDir,
    assetsDir,
    site,
    themeDir,
    pages,
    userConfig,
    configPath,
    configDeps,
    outDir,
    cacheDir,
    logger,
    tempDir: resolve(root, '.temp'),
    vite: userConfig.vite,
    markdown: userConfig.markdown,
  };

  return config;
}
