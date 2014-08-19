#!/usr/bin/env node

var commander = require('commander');
var lib = require('./lib');

// TODO: get version from package.json

program
  .version('0.1.0')
  .option('-p, --path', 'Path from which to begin merging')
  .option('-o, --output', 'Path of dir in which to output merged files')
  .parse(process.argv);

if (!program.path && program.output) return process.help();

// TODO: else execute merge op

