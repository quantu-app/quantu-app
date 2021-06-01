const { app, BrowserWindow } = require('electron');

const { HOST = 'localhost', PORT = 3000 } = process.env;

async function whenServerReady() {
	const { instance } = await import('../build/index.js');

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
	if (app.isPackaged) {
		await whenServerReady();
	}
	win = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true
		}
	});
	win.setMenu(null);
	if (!app.isPackaged) {
		win.webContents.openDevTools();
	}
	win.loadURL(`http://${HOST}:${PORT}`);
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
