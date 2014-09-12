/**
 * Module dependencies.
 */

var fs = require('fs');
var cp = require('cp');
var format = require('util').format;
var resolve = require('path').resolve;
var dirname = require('path').dirname;
var basename = require('path').basename;

/**
 * Depth-first traverse a directory starting at the root path `startPath` and
 * apply function `fn` to all non-directory contents of the root directory.
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

/**
 * file should be path to file
 * deals with name conflicts
 *
 * isCopy: true: cp; false: mv
 */

function moveSync(file, newPath, isCopy) {
  var siblings = fs.readdirSync(newPath);

  _moveSync(0);

  function _moveSync(i) {
    var name = getName(file, i);
    var unique = (siblings.indexOf(name) == -1);
    var dest = resolve(newPath, name);

    // TODO: add verbose flag
    // c.log(format('~~Name change from [%s][%d] to [%s]', file, i, name));

    if (unique && isCopy) cp.sync(file, dest);
    else if (unique) fs.renameSync(file, dest);
    else {
      if (i === 0) i++;
      _moveSync(++i);
    }
  }
}

function cpSync(file, newPath) {
  moveSync(file, newPath, true);
}

function getName(path, i) {
  var file, parts, name, extension;
  if (!i) return basename(path);

  file = basename(path);
  parts = file.split('.');

  name = (file[0] == '.')

      // dotfile:
      ? '.'.concat(parts.splice(0,2).join(''))

      // not a dotfile:
      : parts.shift();

  extension = (parts.length > 0)

    // file extension:
    ? '.'.concat(parts.join('.'))

    // no file extension:
    : '';

  return format('%s %d%s', name, i, extension);
}

//---- Exports

module.exports.traverseSync = traverseSync;
module.exports.moveSync = moveSync;
module.exports.cpSync = cpSync;
module.exports.getName = getName;

