const runCommand = require('./runCommand.cjs');

async function main() {
	await runCommand('rollup', [
		'build/index.js',
		'--file',
		'build/server.js',
		'--format',
		'cjs',
		'-p',
		'terser',
		'-p',
		'@rollup/plugin-node-resolve',
		'-p',
		'@rollup/plugin-commonjs'
	]);
}

main().catch((e) => {
	throw e;
});
