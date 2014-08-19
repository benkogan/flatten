/**
 * Module dependencies.
 */

var fs = require('fs');
var resolve = require('path').resolve;
var rm = require('rimraf');
var should = require('should');
var mergeDir = require('./../');

var testDir = resolve(__dirname, '..', '.test_dir');

var empty = resolve(testDir, 'empty');
var one = resolve(testDir, 'one');

var lvl0 = [];
var lvl1 = [];

describe('flatten', function(){

  before(function(){
    var i, lvl, path, file, name, msg;

    //////////////
    // NOTE: dir will be changed to `testDir`
    /*
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
      process.chdir(testDir);

      level0 = lib.build(parent0, 0);
      level1 = lib.build(parent1, 1);

    }
    */
    //////////////

    // TODO: else issue: dir already exists, exit 1
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
      fs.mkdirSync(empty);
      fs.mkdirSync(one);

      // empty stucture
      for (i = 0; i < 5; i++) {
        name = 'empty-sub-' + i;
        path = resolve(empty, name);

        fs.mkdirSync(path);
        lvl0.push(file);
      }

      // lvl 1
      for (i = 0; i < 5; i++) {
        lvl = 'lvl-1';
        name = lvl + '-sub-' + i;
        path = resolve(one, name);
        file = resolve(path, 'file-' + name);
        msg = 'hello ' + name;

        fs.mkdirSync(path);
        fs.writeFileSync(file, msg);
        lvl1.push(file);
      }
    }
  })

  after(function(){
    rm.sync(testDir);
  })

  describe('#traverse(startPath, fn)', function(){

    it('should do nothing over an empty 1-level dir structure', function(){
      var dirs = [];
      mergeDir.traverse(empty, function(dir){
        dirs.push(dir);
      });

      dirs.should.eql([]);
    });

    it('should map fn over a 1-level dir structure', function(){
      var dirs = [];
      mergeDir.traverse(testDir, function(dir){
        dirs.push(dir);
      });

      dirs.should.eql(lvl1);
    })

  })
})


