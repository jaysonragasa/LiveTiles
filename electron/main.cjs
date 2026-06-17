const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development' || process.env.DEBUG_ELECTRON || !app.isPackaged;

async function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // In production, the backend server needs to be spawned by Electron.
  // In development, `npm run dev:desktop` handles it via concurrently.
  if (!isDev) {
    try {
      const serverPath = path.join(__dirname, '../dist/server.cjs');
      const { serverPromise } = require(serverPath);
      await serverPromise;
      console.log('Express backend started inside Electron.');
    } catch (err) {
      console.error('Failed to start bundled backend server:', err);
    }
  }

  // Load the web app. It is always hosted on localhost:3000 by our Express server.
  win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
