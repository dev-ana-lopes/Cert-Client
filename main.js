'use strict';
const electronApp = require('electron').app;
const electronBrowserWindow = require('electron').BrowserWindow;
const electronIpcMain = require('electron').ipcMain;
const nodePath = require("path");
const services = require('./services');

let window;

function createWindow() {
    const window = new electronBrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: nodePath.join(__dirname, 'preload.js')
        }
    });

    window.loadFile('index.html')
        .then(() => { window.show(); });

    return window;
}

electronApp.on('ready', () => {
    window = createWindow();
});

electronApp.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electronApp.quit();
    }
});

electronApp.on('activate', () => {
    if (electronBrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

electronIpcMain.on('verifyPfxToCrt', (event, files) => {
    const { pfxFilePath, pfxFileName, pfxPassword } = files;
   
    console.log('\nLOG:', pfxFilePath, pfxFileName, pfxPassword);

    services.convertPfxToCrt(pfxFilePath, pfxFileName, pfxPassword);
})

electronIpcMain.on('verifyCrtToPfx', (event, files) => {
    const { crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, crtPassword } = files;
    
    console.log('\nLOG:', crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, crtPassword);

    services.convertCrtToPfx(crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, crtPassword);
})

services.eventEmitter.on('invalidFile', (data) => {
    console.log('\nArquivo invlido:', data.pfxFileName);
});