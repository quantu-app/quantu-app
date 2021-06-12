const { app, BrowserWindow } = require('electron');

const { HOST = 'localhost', PORT = 3000 } = process.env;

let win = null;

async function main() {
	win = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true
		}
	});
	win.setMenu(null);
	win.webContents.openDevTools();
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
