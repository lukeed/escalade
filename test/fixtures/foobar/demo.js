//~> demo.js
const { join } = require('path');
const escalade = require('escalade/sync');

const input = join(__dirname, 'demo.js');
// or: const input = __dirname;

const pkg = escalade(input, (dir, names) => {
  console.log('~> dir:', dir);
  console.log('~> names:', names);
  console.log('---');

  if (names.includes('package.json')) {
    // will be resolved into absolute
    return 'package.json';
  }
});

//~> dir: /Users/lukeed/oss/escalade/test/fixtures/foobar
//~> names: ['demo.js']
//---
//~> dir: /Users/lukeed/oss/escalade/test/fixtures
//~> names: ['index.js', 'foobar']
//---
//~> dir: /Users/lukeed/oss/escalade/test
//~> names: ['fixtures']
//---
//~> dir: /Users/lukeed/oss/escalade
//~> names: ['package.json', 'test']
//---

console.log(pkg);
//=> /Users/lukeed/oss/escalade/package.json

// Now search for "license"
// ~> Will never leave "/Users/lukeed/oss/escalade" directory
const license = escalade(input, (dir, names) => {
  console.log('~> dir:', dir);
  return names.includes('missing123') && 'missing123';
});

//~> dir: /Users/lukeed/oss/escalade/test/fixtures/foobar
//~> dir: /Users/lukeed/oss/escalade/test/fixtures
//~> dir: /Users/lukeed/oss/escalade/test
//~> dir: /Users/lukeed/oss/escalade

console.log(license);
//=> undefined
