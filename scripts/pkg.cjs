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
		const process = spawn(command, args);
		let stdout = Buffer.from(''),
			stderr = Buffer.from('');

		process.stdout.on('data', (data) => {
			console.log(data.toString());
			stdout = Buffer.concat([stdout, data]);
		});
		process.stderr.on('data', (data) => {
			console.error(data.toString());
			stderr = Buffer.concat([stderr, data]);
		});
		process.on('close', (code) => {
			const result = {
				stdout: stdout.toString(),
				stderr: stderr.toString()
			};
			if (code === 0) {
				resolve(result);
			} else {
				reject(result);
			}
		});
	});
}

async function main() {
	const { stdout } = await runCommand('rustc', ['-vV']);
	await replaceInFile('build/index.js', /import\.meta\.url/g, '__filename');
	await replaceInFile('build/middlewares.js', /import\.meta\.url/g, '__filename');
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
