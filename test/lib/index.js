/**
 * Module dependencies.
 */

var fs = require('fs');
var format = require('util').format;
var resolve = require('path').resolve;

// number of child dirs/files to make
var CHILDREN = 5;

// TODO: if `level===undefined`, do empty

function build(parent, level) {
  // TODO: remove check? do differently?
  if (!fs.existsSync(parent))
    fs.mkdirSync(parent);

  function _build(_parent, level) {
    var child, name, path, file, message;

    for (child = CHILDREN; child > 0; child--) {
      name = format('level-%d-child-%d', level, child);
      path = resolve(_parent, name);
      file = path.concat('.txt');
      message = format('hello %s', name);

      fs.writeFileSync(file, message);

      if (level > 0) {
        fs.mkdirSync(path);
        _build(path, --level);
      }

    }
  }

  _build(parent, level);
  return; // TODO: return the contents array
}

//---- Exports

module.exports.build = build;

// TODO NEXT: test this bare builder
//            then add return array of names etc
//            then add functionality for empty level
//            or, split this last one into a sep sub-fn used by `build`

