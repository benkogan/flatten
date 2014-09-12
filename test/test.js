/**
 * Module dependencies.
 */

var fs = require('fs');
var resolve = require('path').resolve;
var rm = require('rimraf');
var should = require('should');
var flatten = require('./../');
var lib = require('./lib');

var testDir = resolve(__dirname, '..', '.test_dir');

describe('flatten', function(){
  before(function(){
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
      process.chdir(testDir);
      // CWD is now `testDir`
    } else throw new Error('Test directory aleady exists');
  })

  after(function(){ rm.sync(testDir); })

  describe('#traverseSync(path, fn)', function(){
    it('should map fn over an empty dir structure', function(){
      var dirs = [];
      var dir = resolve(testDir, 'base');
      lib.build(dir, 'base case');

      flatten.traverseSync(dir, function(content){
        dirs.push(content);
      });

      // base case has no contents
      dirs.should.eql([]);
    })
    it('should map fn over a 1-level dir structure', function(){ testLvl(1); })
    it('should map fn over a 2-level dir structure', function(){ testLvl(2); })
    it('should map fn over a 3-level dir structure', function(){ testLvl(3); })
  })

  describe('#moveSync(file, path)', function(){
    it('should move a file', function(){
      var parentDir = resolve(testDir, 'move');
      var childDir = resolve(parentDir, 'dest');
      var file = resolve(parentDir, 'file');

      fs.mkdirSync(parentDir);
      fs.mkdirSync(childDir);
      fs.writeFileSync(file);

      flatten.moveSync(file, childDir);
      fs.readdirSync(parentDir).should.eql(['dest']);
      fs.readdirSync(childDir).should.eql(['file']);
    })
    it('should move and rename a file if conflicts', function(){
      var parentDir = resolve(testDir, 'move_2');
      var childDir = resolve(parentDir, 'dest');

      var file = resolve(parentDir, 'file');
      var conflict = resolve(childDir, 'file');

      fs.mkdirSync(parentDir);
      fs.mkdirSync(childDir);
      fs.writeFileSync(file);
      fs.writeFileSync(conflict);

      flatten.moveSync(file, childDir);
      fs.readdirSync(parentDir).should.eql(['dest']);
      fs.readdirSync(childDir).should.eql(['file', 'file 2']);
    })
    it('should handle multiple conflicts while moving', function(){
      var parentDir = resolve(testDir, 'move_3');
      var childDir = resolve(parentDir, 'dest');

      var file = resolve(parentDir, 'file');

      var conflict0 = resolve(childDir, 'file');
      var conflict1 = resolve(childDir, 'file 2');
      var conflict2 = resolve(childDir, 'file 3');

      fs.mkdirSync(parentDir);
      fs.mkdirSync(childDir);
      fs.writeFileSync(file);
      fs.writeFileSync(conflict0);
      fs.writeFileSync(conflict1);
      fs.writeFileSync(conflict2);

      flatten.moveSync(file, childDir);
      fs.readdirSync(parentDir).should.eql(['dest']);
      fs.readdirSync(childDir).should.eql(['file', 'file 2', 'file 3', 'file 4']);
    })
  })

  describe('#getName(path, i)', function(){
    it('should generate a name for a file specified by path', function(){
      flatten.getName('/Eli/Docs/file').should.equal('file');
    })
    it('should generate an incremented name for a file', function(){
      flatten.getName('/Eli/Docs/file', 1).should.equal('file 1');
    })
    it('should work when files has an extension', function(){
      flatten.getName('/Eli/Docs/file.txt', 1).should.equal('file 1.txt');
    })
    it('should work when files has two extensions', function(){
      flatten.getName('/Eli/Docs/file.ex.md', 1).should.equal('file 1.ex.md');
    })
  })
}) // end `describe('flatten')`

/**
 * Run test for synchronous traversal of number `level` levels of
 * nested directories.
 */

function testLvl(level) {
  var dir = resolve(testDir, 'level_' + level);
  var contents = lib.build(dir, level);
  var mapped = [];

  flatten.traverseSync(dir, function(content){
    mapped.push(content);
  });

  mapped.sort().should.eql(contents.sort());
}

