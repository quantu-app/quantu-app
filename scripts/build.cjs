const fs = require('fs/promises');
const runCommand = require('./runCommand.cjs');

let extension = '';
if (process.platform === 'win32') {
	extension = '.exe';
}

async function main() {
	const { stdout } = await runCommand('rustc', ['-vV']);
	await runCommand('pkg', ['.', '--output', 'src-tauri/binaries/app']);

	const targetTriple = /host: (\S+)/g.exec(stdout)[1];
	if (!targetTriple) {
		console.error('Failed to determine platform target triple');
	}
	await fs.rename(
		`src-tauri/binaries/app${extension}`,
		`src-tauri/binaries/app-${targetTriple}${extension}`
	);
}

main().catch((e) => {
	throw e;
});
