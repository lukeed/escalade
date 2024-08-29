import { execSync } from "node:child_process";
import { join, resolve } from "node:path";
import { copyFileSync } from "node:fs";

execSync("npm run build", {
	stdio: "inherit",
});

let root = resolve(".");
let input = resolve("src");

copyFileSync(
	join(input, "async.d.mts"),
	join(root, "index.d.mts"),
);

copyFileSync(
	join(input, "async.d.ts"),
	join(root, "index.d.ts"),
);

console.log("+ async dts files");

copyFileSync(
	join(input, "sync.d.mts"),
	join(root, "sync/index.d.mts"),
);

copyFileSync(
	join(input, "sync.d.ts"),
	join(root, "sync/index.d.ts"),
);

console.log("+ sync dts files");
