declare module 'escalade' {
	type Promisable<T> = T | Promise<T>;
	export type Callback = (directory: string, files: string[]) => Promisable<string | false | void>;
	export default function (directory: string, callback: Callback): Promise<string | void>;
}

declare module 'escalade/sync' {
	export type Callback = (directory: string, files: string[]) => string | false | void;
	export default function (directory: string, callback: Callback): string | void;
}
