import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import startServer from './koa';


let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 736,
    width: 414,
    resizable: false,
    // fullscreen: false,
    fullscreenable: false,
    titleBarStyle: 'hiddenInset',
    // transparent: true,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      // nodeIntegrationInWorker: true,
      preload: path.join(__dirname, './public/renderer.js')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8000/#/');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, './dist/renderer/index.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

}

app.on('ready', () => {
  startServer()
  createWindow()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
