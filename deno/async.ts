import { dirname, resolve } from 'https://deno.land/std/path/mod.ts'

type Promisable<T> = T | Promise<T>;
export type Callback = (directory: string, files: string[]) => Promisable<string | false | void>

async function toItems(dir: string) {
	let list = [];
	for await (let tmp of Deno.readDir(dir)) {
		list.push(tmp.name);
	}
	return list;
}

/** Requires `allow-read` permission. */
export default async function (start: string, callback: Callback) {
	let dir = resolve('.', start);
	let stats = await Deno.stat(dir);

	if (!stats.isDirectory) {
		dir = dirname(dir);
	}

	while (true) {
		let tmp = await callback(dir, await toItems(dir));
		if (tmp) return resolve(dir, tmp);
		dir = dirname(tmp = dir);
		if (tmp === dir) break;
	}
}
