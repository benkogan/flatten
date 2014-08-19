/**
 * Module dependencies.
 */

var fs = require('fs');
var resolve = require('path').resolve;

// TODO: if output dir not exist, make it (recursively)

/**
 * traverse dirs and apply second arg to contents
 * applies fn to path of item
 */

function traverse(startPath, fn) {
  var i, item, isDir;
  var contents = fs.readdirSync(startPath);

  for (i = 0; i < contents.length; i++) {
    item = resolve(startPath, contents[i]);
    isDir = fs.lstatSync(item).isDirectory();

    if (isDir) traverse(item, fn);
    else fn(item);
  }
}

//---- Exports

module.exports.traverse = traverse;

