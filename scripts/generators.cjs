const fs = require('fs/promises');
const path = require('path');

const BASE_DIR = 'src/lib/generators';
const OUT_FILE = 'src/lib/generators.ts';

async function* walk(dir) {
	for await (const d of await fs.opendir(dir)) {
		const entry = path.join(dir, d.name);
		if (d.isDirectory()) yield* walk(entry);
		else if (d.isFile()) yield entry;
	}
}

async function main() {
	await fs.writeFile(OUT_FILE, 'export default {\n');
	for await (const entry of walk(BASE_DIR)) {
		const name = path
			.join(path.relative(BASE_DIR, path.dirname(entry)), path.parse(entry).name)
			.replace('/', '_');
		const appPath = path.join(path.dirname(entry.replace('src/', '$')), path.parse(entry).name);
		await fs.appendFile(OUT_FILE, `\t${name}: () => import('${appPath}'),\n`);
	}
	await fs.appendFile(OUT_FILE, '};');
}

main();
