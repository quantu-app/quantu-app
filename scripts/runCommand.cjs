const spawn = require('child_process').spawn;

module.exports = function runCommand(command, args) {
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
};
