#! /usr/bin/env node
import { Command } from 'commander';

const program = new Command();

console.log('nant cli');

program
  .command('init')
  .description('init nant ui template')

  .action(async () => {
    const { init } = await import('./commands/init.js');
    return init();
  });

program
  .command('dev')
  .description('Run nant ui development environment')

  .action(async () => {
    const { dev } = await import('./commands/dev.js');
    return dev();
  });

program
  .command('preview')
  .description('Preview nant ui development environment')

  .action(async () => {
    const { preview } = await import('./commands/preview.js');
    return preview();
  });

program
  .command('test')
  .description('Run Jest in work directory')
  .option('-w, --watch', 'Watch files for changes and rerun tests related to changed files')
  .option('-wa, --watchAll', 'Watch files for changes and rerun all tests when something changes')
  .option('-c, --component <componentName>', 'Test a specific component')
  .option('-cc --clearCache', 'Clear test cache')
  .action(async (option) => {
    const { test } = await import('./commands/test.js');
    return test(option);
  });

program
  .command('build')
  .description('Build nant ui development environment')

  .action(async () => {
    const { build } = await import('./commands/build.js');
    return build();
  });

program
  .command('build:icons')
  .description('Build icons')
  .action(async () => {
    console.log('Building icons...');
    const { icons } = await import('./commands/icons.js');
    return icons();
  });

program.on('command:*', async ([cmd]) => {
  program.outputHelp();
  console.error(`\nUnknown command ${cmd}.\n`);
  process.exitCode = 1;
});

program.parse();
