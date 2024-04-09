'use strict';

const electronApp = require('electron').app;
const electronBrowserWindow = require('electron').BrowserWindow;
const electronIpcMain = require('electron').ipcMain;

const nodePath = require("path");
const nodeChildProcess = require('child_process');

const{isPfx,isKey,isCrt,corvertPfx} = require('./service');

let window;

function createWindow() {
    const window = new electronBrowserWindow({
        x: 0,
        y: 0,
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
    console.log('Caminho do arquivo PFX:', pfxFilePath);
    console.log('Nome do arquivo PFX:', pfxFileName);
    console.log('Caminho do arquivo de senha do PFX:', pfxKeyFilePath);
    console.log('Nome do arquivo de senha do PFX:', pfxKeyFileName);

   console.log(isPfx(pfxFileName));
})

electronIpcMain.on('convertCrtAndKeyToPfx', () => {
    console.log("soco");
})


electronIpcMain.on('runScript', () => {
    // Windows
    let script = nodeChildProcess.spawn('cmd.exe', ['/c', 'test.bat', 'arg1', 'arg2']);

    // MacOS & Linux
    // let script = nodeChildProcess.spawn('bash', ['test.sh', 'arg1', 'arg2']);

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