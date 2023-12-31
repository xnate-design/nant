import fse from 'fs-extra';
import { fileURLToPath } from 'url';
import { CLI_PACKAGE_JSON } from './constant.js';

const {
  appendFileSync,
  ensureFileSync,
  lstatSync,
  outputFileSync,
  pathExistsSync,
  readdir,
  readFileSync,
  readJSONSync,
} = fse;

export function getDirname(url: string): string {
  return fileURLToPath(new URL(' ', url));
}

export const toPascalCase = (str: string) =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
    .join('');

export function getCliVersion() {
  return readJSONSync(CLI_PACKAGE_JSON).version;
}

export const outputFileSyncOnChange = (path: string, code: string) => {
  ensureFileSync(path);
  const content = readFileSync(path, 'utf8');
  if (content !== code) {
    outputFileSync(path, code);
  }
};
