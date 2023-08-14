import fse from 'fs-extra';
import { fileURLToPath } from 'url';

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
