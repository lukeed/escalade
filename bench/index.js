const assert = require('assert');
const { resolve } = require('path');
const { Suite } = require('benchmark');
const sync = require('escalade/sync');
const escalade = require('escalade');
const findup = require('find-up');

const fixtures = resolve(__dirname, 'fixtures');
const file = resolve(fixtures, 'a/b/c/d/e/f/g/h/i/j/file.txt');

const filter = name => (dir, files) => files.includes(name) && name;

const contenders = {
	'find-up': x => findup(x, { cwd: file }),
	'escalade': x => escalade(file, filter(x)),
	'find-up.sync': x => findup.sync(x, { cwd: file }),
	'escalade/sync': x => sync(file, filter(x)),
}

function pad(str) {
	return str + ' '.repeat(16 - str.length);
}

async function runner(target, expects) {
	console.log(`\nValidation (target = "${target}"): `);
	for (const name of Object.keys(contenders)) {
		try {
			const output = await contenders[name](target);

			if (expects) assert.equal(typeof output, 'string', 'returns string');
			assert.equal(output, expects);

			console.log('  ✔', pad(name));
		} catch (err) {
			console.log('  ✘', pad(name), `(FAILED @ "${err.message}")`);
		}
	}
	console.log(`\nBenchmark (target = "${target}"):`);
	const bench = new Suite().on('cycle', e => {
		console.log('  ' + e.target);
	});

	Object.keys(contenders).forEach(name => {
		if (name.includes('sync')) {
			bench.add(pad(name), () => {
				contenders[name](target);
			});
		} else {
			bench.add(pad(name), async () => {
				await contenders[name](target);
			}, { async: true });
		}
	});

	return new Promise((res, rej) => {
		bench.on('complete', res);
		bench.on('error', rej);
		bench.run();
	});
}

(async function () {
	await runner('foo.txt', resolve(fixtures, 'a/b/c/d/e/f/foo.txt')); // ~> 6 lvls
	await runner('package.json', resolve(__dirname, 'package.json')); // ~> 12 lvls
	await runner('missing123.txt', undefined); // ~> 15? root
})().catch(err => {
	console.error('Oops~!', err)
});
