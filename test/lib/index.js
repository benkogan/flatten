/**
 * Module dependencies.
 */

var fs = require('fs');
var format = require('util').format;
var resolve = require('path').resolve;

// number of child dirs/files to make
var CHILDREN = 5;

// returns arr of non-dir contents
// base case: empty dir structure
function build(parent, level) {
  var contents = [];
  var base = false;

  if (level === 'base case') { base = true; level = 1; }
  if (!fs.existsSync(parent)) fs.mkdirSync(parent);

  function _build(_parent, level) {
    var child, name, path, file, message;

    for (child = CHILDREN; child > 0; child--) {
      name = format('level-%d-child-%d', level, child);
      path = resolve(_parent, name);
      file = path.concat('.txt');
      message = format('hello %s', name);

      if (!base) {
        fs.writeFileSync(file, message);
        contents.push(file);
      }

      if (level > 0) {
        fs.mkdirSync(path);
        _build(path, level - 1);
      }

    }
  }

  _build(parent, level);

  // `contents` is unsorted
  return contents;
}

//---- Exports

module.exports.build = build;

