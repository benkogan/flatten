#!/usr/bin/env node

var program = require('commander');
var version = require('../package.json').version;
var lib = require('..');

// TODO: something isnt right here...
// TODO: deal with all flag input cases (like one but not the other)

program
  .version(version)
  .option('-p, --path [path]', 'Path from which to begin merging', 'string')
  .option('-o, --output [path]', 'Path of dir in which to output merged files', 'string')
  .parse(process.argv);

if (!program.path && !program.output) return program.help();

console.log('  Moving from <' + program.path + '> to <' + program.output + '>');

lib.traverseSync(program.path, function(file){
  var dest = program.output;
  lib.cpSync(file, dest);
});

