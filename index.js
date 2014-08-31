/**
 * Module dependencies.
 */

var fs = require('fs');
var format = require('util').format;
var resolve = require('path').resolve;
var dirname = require('path').dirname;
var basename = require('path').basename;

/**
 * traverse dirs and apply second arg to contents
 * applies fn to path of item
 */

function traverseSync(startPath, fn) {
  var i, item, isDir;
  var contents = fs.readdirSync(startPath);

  for (i = 0; i < contents.length; i++) {
    item = resolve(startPath, contents[i]);
    isDir = fs.lstatSync(item).isDirectory();

    if (isDir) traverseSync(item, fn);
    else fn(item);
  }
}

/*
 * file should be path to file
 * deals with name conflicts
 */

function moveSync(file, newPath) {
  var siblings = fs.readdirSync(newPath);

  _moveSync(0);

  function _moveSync(i) {
    var path = (i) ? format('%s-%d', file, i) : file;
    var name = basename(path);
    var unique = (siblings.indexOf(name) == -1);
    var dest = resolve(newPath, name);

    if (unique) fs.renameSync(file, dest);
    else _moveSync(++i);
  }
}

//---- Exports

module.exports.traverseSync = traverseSync;
module.exports.moveSync = moveSync;

