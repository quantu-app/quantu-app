'use strict';

const execa = require('execa');
const fs = require('fs');
const replace = require('replace-in-file');
const { spawn } = require('child_process');

let extension = '';
if (process.platform === 'win32') {
	extension = '.exe';
}

function runCommand(command, args) {
	return new Promise((resolve, reject) => {
		console.log(`${command} ${args.join(' ')}`);
		const process = spawn(command, args);
		process.stdout.on('data', (data) => console.log(data.toString()));
		process.stderr.on('data', (data) => console.error(data.toString()));
		process.on('close', (code) => (code === 0 ? resolve() : reject(code)));
	});
}

async function main() {
	await replace({
		files: 'build/index.js',
		from: /import\.meta\.url/g,
		to: '__filename'
	});

	await runCommand('pkg', ['package.json', '--output', 'src-tauri/binaries/app']);

	const rustInfo = (await execa('rustc', ['-vV'])).stdout;
	const targetTriple = /host: (\S+)/g.exec(rustInfo)[1];
	if (!targetTriple) {
		console.error('Failed to determine platform target triple');
	}
	fs.renameSync(
		`src-tauri/binaries/app${extension}`,
		`src-tauri/binaries/app-${targetTriple}${extension}`
	);
}

main().catch((e) => {
	throw e;
});
