import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import startServer from './koa';


let mainWindow = null;
const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV === 'development';
const template = [
  ...(isMac ? [{
    label: 'NetSend',
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  ...(isDev ? [{
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
    ]
  }] : []),
  {
    label: 'language',
    submenu: [
      {
        id: 'zh-CN',
        label: '中文',
        type: 'radio',
        checked: false,
        click: (menuItem) => { mainWindow.webContents.send('mainChangeLanguage', menuItem.id); }
      },
      {
        id: 'en-US',
        label: 'English',
        type: 'radio',
        checked: false,
        click: (menuItem) => { mainWindow.webContents.send('mainChangeLanguage', menuItem.id); }
      }
    ],
  },
]


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
      enableRemoteModule: true,
      // nodeIntegrationInWorker: true,
      preload: path.join(__dirname, './public/renderer.js')
    }
  });

  if (isDev) {
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


ipcMain.on('syncLanguage', (event, arg) => {
  genMenu(arg)
  event.returnValue = 'pong'
});

const genMenu = (lang) => {
  if (lang) {
    for (const item of template) {
      if (item.label === 'language') {
        for (const ele of item.submenu) {
          if (ele.id === lang) {
            ele.checked = true
          } else {
            ele.checked = false
          }
        }
      }
    }
  }
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}


app.on('ready', () => {
  startServer()
  createWindow()
  const lang = app.getLocale()
  global.lang = { lang }
  genMenu(lang === 'zh-CN' ? 'zh-CN' : 'en-US')
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
