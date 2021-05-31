const { app, BrowserWindow } = require('electron'); // eslint-disable-line @typescript-eslint/no-var-requires

const { HOST = '0.0.0.0', PORT = 3000 } = process.env;

function onReady() {
	const win = new BrowserWindow();
	win.setMenu(null);
	win.loadURL(`http://${HOST}:${PORT}`);
}

app.whenReady().then(onReady);
