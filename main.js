'use strict';
const electronApp = require('electron').app;
const electronBrowserWindow = require('electron').BrowserWindow;
const electronIpcMain = require('electron').ipcMain;

const nodePath = require("path");
const nodeChildProcess = require('child_process');
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

electronIpcMain.on('convertPfxToCrt', (event, files) => {
    const { pfxFilePath, pfxFileName, pfxKeyFilePath, pfxKeyFileName } = files;
   
    console.log('LOG:', pfxFilePath, pfxFileName, pfxKeyFilePath, pfxKeyFileName);

    services.convertPfxToCrt(pfxFilePath, pfxFileName, pfxKeyFilePath, pfxKeyFileName);
    
    
})

electronIpcMain.on('convertCrtAndKeyToPfx', () => {
    console.log("soco");
})

services.eventEmitter.on('invalidFile', (data) => {
    console.log('Arquivo invlido:', data.pfxFileName, data.pfxKeyFileName);
});

electronIpcMain.on('runScript', () => {
    let script = nodeChildProcess.spawn('cmd.exe', ['/c', 'test.bat', 'arg1', 'arg2']);

    console.log('PID: ' + script.pid);

    script.stdout.on('data', (data) => {
        console.log('stdout: ' + data);
    });

    script.stderr.on('data', (err) => {
        console.log('stderr: ' + err);
    });

    script.on('exit', (code) => {
        console.log('Exit Code: ' + code);
    });
})