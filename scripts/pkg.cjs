const fs = require('fs/promises');
const { spawn } = require('child_process');
const replaceInFile = require('./replaceInFile.cjs');

let extension = '';
if (process.platform === 'win32') {
	extension = '.exe';
}

function runCommand(command, args) {
	return new Promise((resolve, reject) => {
		console.log(`${command} ${args.join(' ')}`);
		const process = spawn(command, args),
			data = {
				stdout: '',
				stderr: ''
			};
		process.stdout.on('data', (data) => (data.stdout += data.toString()));
		process.stderr.on('data', (data) => (data.stderr += data.toString()));
		process.on('close', (code) => (code === 0 ? resolve(data) : reject(data)));
	});
}

async function main() {
	const [_replaceInFile, _pkg, { stdout }] = await Promise.all([
		replaceInFile('build/index.js', /import\.meta\.url/g, '__filename'),
		runCommand('pkg', ['package.json', '--output', 'src-tauri/binaries/app']),
		runCommand('rustc', ['-vV'])
	]);
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
