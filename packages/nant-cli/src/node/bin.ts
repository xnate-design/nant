#! /usr/bin/env node
import { Command } from 'commander';

const program = new Command();

console.log('nant cli');

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
