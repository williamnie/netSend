const { ipcRenderer, clipboard, contextBridge, shell } = require('electron')
const fs = require('fs')
const path = require('path')
const os = require('os')



contextBridge.exposeInMainWorld('electronApi', {
    setLang: (lang) => ipcRenderer.sendSync('syncLanguage', lang),
    changeLang: (cb) => ipcRenderer.on('mainChangeLanguage', cb),
    serverState: (cb) => ipcRenderer.on('serverStart', cb),
    statSync: (filePath) => fs.statSync(filePath),
    isFile: (filePath) => fs.statSync(filePath).isFile(),
    basename: (filePath) => path.basename(filePath),
    copy: (string) => clipboard.writeText(string),
    networkInterfaces: () => os.networkInterfaces(),
    openUrl: (url) => shell.openExternal(url)
})