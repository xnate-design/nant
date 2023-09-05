import { copy, remove } from 'fs-extra';
import { watch } from 'chokidar';
import { normalizePath } from 'vite';

function toLib(file) {
  return normalizePath(file).replace(/^src\//, 'lib/');
}

// copy non ts files, such as an html or css, to the dist directory whenever
// they change.
watch('src/client/**/!(*.ts|*.tsx|tsconfig.json)')
  .on('change', (file) => copy(file, toLib(file)))
  .on('add', (file) => copy(file, toLib(file)))
  .on('unlink', (file) => remove(toLib(file)));

// import { copy } from 'fs-extra'
// import fg from 'fast-glob'

// function toDest(file) {
//   return file.replace(/^src\//, 'dist/')
// }

// fg.sync('src/client/**').forEach((file) => {
//   if (/(\.ts|tsconfig\.json)$/.test(file)) return
//   copy(file, toDest(file))
// })
