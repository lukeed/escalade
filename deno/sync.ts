import { dirname, resolve } from 'https://deno.land/std/path/mod.ts'

export type Callback = (directory: string, files: string[]) => string | false | void;

function toItems(dir: string) {
	let list = [];
	for (let tmp of Deno.readDirSync(dir)) {
		list.push(tmp.name);
	}
	return list;
}

/** Requires `allow-read` permission. */
export default function (start: string, callback: Callback) {
	let dir = resolve('.', start);
	let stats = Deno.statSync(dir);

	if (!stats.isDirectory) {
		dir = dirname(dir);
	}

	while (true) {
		let tmp = callback(dir, toItems(dir));
		if (tmp) return resolve(dir, tmp);
		dir = dirname(tmp = dir);
		if (tmp === dir) break;
	}
}
