const { app, BrowserWindow } = require('electron');
const findPort = require('find-open-port');

async function whenServerReady() {
	const { instance } = await import('./build/index.js');

	function isReady(resolve) {
		if (instance.server.listening) {
			setTimeout(() => isReady(resolve));
		} else {
			resolve();
		}
	}

	return new Promise(isReady);
}

let win = null;

async function main() {
	process.env.HOST = 'localhost';
	process.env.PORT = await findPort();
	await whenServerReady();
	win = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true
		}
	});
	win.setMenu(null);
	win.loadURL(`http://${process.env.HOST}:${process.env.PORT}`);
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		onReady();
	}
});

app.whenReady().then(main);
