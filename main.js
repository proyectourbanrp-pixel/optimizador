const { app, BrowserWindow } = require('electron');
const path = require('path');
const { setupIPC } = require('./main-ipc');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            sandbox: true
        }
    });

    mainWindow.loadFile('index.html');
    
    // Setup IPC handlers
    setupIPC(mainWindow);
    
    // Descomenta la siguiente línea para abrir DevTools en desarrollo
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});