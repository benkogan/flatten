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

  after(function(){
    rm.sync(testDir);
  })

  describe('#traverse(path, fn)', function(){
    it('should map fn over an empty dir structure', function(){
      var dirs = [];
      var dir = resolve(testDir, 'base');
      lib.build(dir, 'base case');

      flatten.traverse(dir, function(content){
        dirs.push(content);
      });

      // base case has no contents
      dirs.should.eql([]);
    })
    it('should map fn over a 1-level dir structure', function(){ testLvl(1); })
    it('should map fn over a 2-level dir structure', function(){ testLvl(2); })
    it('should map fn over a 3-level dir structure', function(){ testLvl(3); })
  })

}) // end `describe('flatten')`

function testLvl(level) {
  var dirs = [];
  var dir = resolve(testDir, 'level_' + level);
  var contents = lib.build(dir, level);

  flatten.traverse(dir, function(content){
    dirs.push(content);
  });

  dirs.sort().should.eql(contents.sort());
}
