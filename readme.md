# escalade [![CI](https://github.com/lukeed/escalade/workflows/CI/badge.svg)](https://github.com/lukeed/escalade/actions) [![codecov](https://badgen.now.sh/codecov/c/github/lukeed/escalade)](https://codecov.io/gh/lukeed/escalade)

> A tiny (186B to 214B) and [fast](#benchmarks) utility to ascend parent directories

With [escalade](https://en.wikipedia.org/wiki/Escalade), you can scale parent directories until you've found what you're looking for.<br>Given an input file or directory, `escalade` will continue executing your callback function until either:

1) the callback returns a truthy value
2) `escalade` has reached the root directory (`process.cwd()`)

> **Important:**<br>Please note that `escalade` will never traverse _beyond_ the root directory.<br>Additionally, `escalade` only deals with direct ancestry – it will not dive into parents' sibling directories.

## Install

```
$ npm install --save escalade
```


## Modes

There are two "versions" of `escalade` available:

#### "async"
> **Node.js:** >= 8.x<br>
> **Size (gzip):** 214 bytes<br>
> **Availability:** [CommonJS](https://unpkg.com/escalade/async/index.js), [ES Module](https://unpkg.com/escalade/async/index.mjs)

This is the primary/default mode. It makes use of `async`/`await` and [`util.promisify`](https://nodejs.org/api/util.html#util_util_promisify_original).

#### "sync"
> **Node.js:** >= 6.x<br>
> **Size (gzip):** 186 bytes<br>
> **Availability:** [CommonJS](https://unpkg.com/escalade/sync/index.js), [ES Module](https://unpkg.com/escalade/sync/index.mjs)

This is the opt-in mode, ideal for scenarios where `async` usage cannot be supported.


## Usage

***Example Structure***

> Assume `process.cwd()` is `/Users/lukeed/oss/escalade`

```
/Users/lukeed
  └── oss
    ├── license
    └── escalade
      ├── package.json
      └── test
        └── fixtures
          ├── index.js
          └── foobar
            └── demo.js
```

***Example Usage***

```js
//~> demo.js
import { join } from 'path';
import escalade from 'escalade';

const input = join(__dirname, 'demo.js');
// or: const input = __dirname;

const pkg = await escalade(input, (dir, names) => {
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
const license = await escalade(input, (dir, names) => {
  console.log('~> dir:', dir);
  return names.includes('license') && 'license';
});

//~> dir: /Users/lukeed/oss/escalade/test/fixtures/foobar
//~> dir: /Users/lukeed/oss/escalade/test/fixtures
//~> dir: /Users/lukeed/oss/escalade/test
//~> dir: /Users/lukeed/oss/escalade

console.log(license);
//=> undefined
```

> **Note:** To run the above example with "sync" mode, import from `escalade/sync` and remove the `await` keyword.


## API

### escalade(input, callback)
Returns: `string|void` or `Promise<string|void>`

When your `callback` locates a file, `escalade` will resolve/return with an absolute path.<br>
If your `callback` was never satisfied, then `escalade` will resolve/return with nothing (undefined).

> **Important:**<br>The `sync` and `async` versions share the same API.<br>The **only** difference is that `sync` is not Promise-based.

#### input
Type: `string`

The path from which to start ascending.

This may be a file or a directory path.<br>However, when `input` is a file, `escalade` will begin with its parent directory.

> **Important:** Unless given an absolute path, `input` will be resolved from `process.cwd()` location.

#### callback
Type: `Function`

The callback to execute for each ancestry level. It always is given two arguments:

1) `dir` - an absolute path of the current parent directory
2) `names` - a list (`string[]`) of contents _relative to_ the `dir` parent

> **Note:** The `names` list can contain names of files _and_ directories.

When your callback returns a _falsey_ value, then `escalade` will continue with `dir`'s parent directory, re-invoking your callback with new argument values.

When your callback returns a string, then `escalade` stops iteration immediately.<br>
If the string is an absolute path, then it's left as is. Otherwise, the string is resolved into an absolute path _from_ the `dir` that housed the satisfying condition.

> **Important:** Your `callback` can be a `Promise/AsyncFunction` when using the "async" version of `escalade`.

## Benchmarks

> Running on Node.js v10.13.0

```
# Load Time
  find-up:        3.948ms
  escalade:       0.493ms
  escalade/sync:  0.327ms

# Levels: 6 (target = "foo.txt"):
  find-up              x 30,614 ops/sec ±7.80% (46 runs sampled)
  escalade             x 46,814 ops/sec ±3.38% (74 runs sampled)
  escalade/sync        x  9,319 ops/sec ±0.53% (89 runs sampled)

# Levels: 12 (target = "package.json"):
  find-up              x 26,421 ops/sec ±16.54% (32 runs sampled)
  escalade             x 49,618 ops/sec ±2.82% (80 runs sampled)
  escalade/sync        x  4,721 ops/sec ±0.51% (92 runs sampled)

# Levels: 14 (target = "missing123.txt"):
  find-up              x 30,254 ops/sec ±15.38% (66 runs sampled)
  escalade             x 50,126 ops/sec ±2.45% (84 runs sampled)
  escalade/sync        x  4,173 ops/sec ±0.45% (93 runs sampled)
```


## Related

- [premove](https://github.com/lukeed/premove) - A tiny (247B) utility to remove items recursively
- [totalist](https://github.com/lukeed/totalist) - A tiny (195B to 224B) utility to recursively list all (total) files in a directory
- [mk-dirs](https://github.com/lukeed/mk-dirs) - A tiny (420B) utility to make a directory and its parents, recursively

## License

MIT © [Luke Edwards](https://lukeed.com)
