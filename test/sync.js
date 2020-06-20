import { test } from 'uvu';
import { homedir } from 'os';
import { join, resolve } from 'path';
import * as assert from 'uvu/assert';
import escalade from '../src/sync';

const fixtures = join(__dirname, 'fixtures');

test('should export a function', () => {
	assert.type(escalade, 'function');
});

test('should convert relative output into absolute', () => {
	let output = escalade(fixtures, () => 'foobar.js');
	assert.is(output, join(fixtures, 'foobar.js'));
});

test('should respect absolute output', () => {
	let foobar = resolve('.', 'foobar.js');
	let output = escalade(fixtures, () => foobar);
	assert.is(output, foobar);
});

test('should allow file input', () => {
	let levels = 0;
	let input = join(fixtures, 'index.js');
	let output = escalade(input, dir => {
		levels++;
		return dir === fixtures && fixtures;
	});
	assert.is(levels, 1)
	assert.is(output, fixtures);
});

test('should receive directory names in contents list', () => {
	let levels = 0;
	let output = escalade(fixtures, (dir, files) => {
		levels++;
		return files.includes('fixtures') && 'fixtures';
	});

	assert.is(levels, 2);
	assert.is(output, fixtures);
});

test('should terminate walker immediately', () => {
	let levels = 0;
	let output = escalade(fixtures, () => `${++levels}.js`);

	assert.is(levels, 1);
	assert.is(output, join(fixtures, '1.js'));
});

test('should traverse until root directory', () => {
	let levels = 0;

	let output = escalade(fixtures, () => {
		levels++;
		return false;
	});

	assert.is(output, undefined);
	assert.is(levels, fixtures.split(/[\\\/]+/g).length);
});

test('should end after `process.cwd()` read', () => {
	let levels = 0;
	let output = escalade(fixtures, (dir, files) => {
		levels++;
		if (files.includes('package.json')) {
			return join(dir, 'package.json');
		}
	});

	assert.is(levels, 3);
	assert.is(output, resolve('.', 'package.json'))
});

test('should handle deeper traversals', () => {
	let levels=0, contents=0;
	const input = join(fixtures, 'foo', 'bar', 'hello', 'world.txt');

	escalade(input, (dir, names) => {
		levels++;
		contents += names.length;
		if (dir === fixtures) return dir;
	});

	assert.is(levels, 4);
	assert.is(contents, 10);
});

test.run();
