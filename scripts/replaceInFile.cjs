const fs = require('fs/promises');

module.exports = async function replaceInFile(file, search, replace) {
	const content = await fs.readFile(file, 'utf8');
	const newContent = content.replace(search, replace);
	await fs.writeFile(file, newContent, 'utf8');
};
