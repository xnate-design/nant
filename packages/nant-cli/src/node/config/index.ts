import fse from 'fs-extra';
import path from 'path';
import logger from '../shared/logger.js';

import { mergeWith } from 'lodash-es';
import { loadConfigFromFile, mergeConfig as mergeViteConfig, normalizePath } from 'vite';
import { ROOT } from '../shared/constant.js';
import { compilePage } from '../compiler/compilePage.js';

import { defaultNantConfig } from './siteConfig.js';

import type { SiteData, DefaultTheme } from '../../../types/shared';
import type { RawConfigExports, UserConfig, NantConfig } from './siteConfig.js';

const supportConfigExts = ['js', 'ts', 'mjs', 'mts'];

const resolve = (root: string, file: string) => {
  return normalizePath(path.resolve(root, '.nant', file));
};

async function resolveConfigExtends(config: RawConfigExports): Promise<UserConfig> {
  const resolved = await (typeof config === 'function' ? config() : config);
  if (resolved.extends) {
    const base = await resolveConfigExtends(resolved.extends);
    return mergeConfig(base, resolved);
  }
  return resolved;
}

function isObject(value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function isArray(value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Array]';
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

export async function resolveSiteData(
  root: string,
  userConfig?: UserConfig,
  command: 'serve' | 'build' = 'serve',
  mode = 'development',
): Promise<SiteData> {
  userConfig = userConfig || (await resolveUserConfig(root, command, mode))[0];

  return {
    title: userConfig.title || 'Nant',
    description: userConfig.description || 'A Nant site',
    base: userConfig.base ? userConfig.base.replace(/([^/])$/, '$1/') : '/',
    themeConfig: userConfig.themeConfig || {},
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

export function mergeStrategy(value: any, srcValue: any, key: string) {
  if (key === 'pages' && isArray(srcValue)) {
    return srcValue;
  }
}

export async function getNantConfig(): Promise<NantConfig<DefaultTheme.Config>> {
  const root = normalizePath(ROOT);

  const defaultConfig = defaultNantConfig;
  const [userConfig] = await resolveUserConfig(root, 'serve', 'development');
  const mergeConfig = { ...mergeWith(defaultConfig, userConfig) };

  await compilePage();

  return mergeConfig;
}
