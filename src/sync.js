import { dirname, resolve } from 'path';
import { readdirSync, statSync } from 'fs';

export default function (start, callback) {
	let tmp, stop = resolve('.');
	let dir = resolve('.', start);
	let stats = statSync(dir);

	if (!stats.isDirectory()) {
		dir = dirname(dir);
	}

	while (dir.startsWith(stop)) {
		tmp = callback(dir, readdirSync(dir));
		if (tmp) return resolve(dir, tmp);
		dir = dirname(dir);
	}
}
