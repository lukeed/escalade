import { dirname, resolve } from 'path';
import { readdir, stat } from 'fs';
import { promisify } from 'util';

const toStats = promisify(stat);
const toRead = promisify(readdir);

export default async function (start, callback) {
	let stop = resolve('.');
	let dir = resolve('.', start);
	let stats = await toStats(dir);
	let tmp, files;

	if (!stats.isDirectory()) {
		dir = dirname(dir);
	}

	while (dir.startsWith(stop)) {
		files = await toRead(dir);
		tmp = await callback(dir, files);
		if (tmp) return resolve(dir, tmp);
		dir = dirname(dir);
	}
}
