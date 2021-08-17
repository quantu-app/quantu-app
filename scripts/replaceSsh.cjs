const replaceInFile = require('./replaceInFile.cjs');

replaceInFile('package-lock.json', /git\+ssh:\/\/git@github\.com/g, 'git+https://github.com');
