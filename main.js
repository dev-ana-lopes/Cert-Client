'use strict';
const electronApp = require('electron').app;
const electronBrowserWindow = require('electron').BrowserWindow;
const electronIpcMain = require('electron').ipcMain;
const nodePath = require("path");
const services = require('./services');

let window;

function createWindow() {
    window = new electronBrowserWindow({
        width: 1100,
        height: 700,
        show: false,
        resizable: false,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: nodePath.join(__dirname, 'preload.js')
        }
    });
    window.setMenu(null);  
    window.loadFile('index.html')
        .then(() => { window.show(); });

    return window;
}

function dialogMessage(message, type) {
    const dialogWindow = new electronBrowserWindow({
        width: 300,
        height: 150,
        resizable: false,
        minimizable: false,
        maximizable: false,
        frame: false,
        x: 990,
        y: 590,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    dialogWindow.loadFile(nodePath.join(__dirname, 'dialog.html')).then(() => {
        dialogWindow.webContents.send('set-message', { message, type });
    });

    const timeout = setTimeout(() => {
        dialogWindow.close();
    }, 60000);

    dialogWindow.on('close', () => {
        clearTimeout(timeout);
    });

    electronIpcMain.once('close-dialog', () => {
        dialogWindow.close();
    });
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
    const { pfxFilePath, pfxFileName, password } = files;
    services.checkToConvertPfxToCrt(pfxFilePath, pfxFileName, password);
});

electronIpcMain.on('verifyCrtToPfx', (event, files) => {
    const { crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, password } = files;
    services.checkToConvertCrtToPfx(crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, password);
});

services.eventEmitter.on('invalidFile', (data) => {
    const message = data.crtFileName && data.crtKeyFileName ?
        `A entrada espera receber um .CRT, mas esta recebendo o tipo: ${data.crtFileName}
     \ne a entrada espera receber um .KEY mas esta recebendo o tipo: ${data.crtKeyFileName}` :
        `A entrada espera receber um .PFX, mas esta recebendo o tipo: ${data.pfxFileName}`;

    dialogMessage(message, 0);
});

services.eventEmitter.on('invalidPassword', (data) => {
    let message;
    if (data.password) {
        message = `Senha digitada, está inválida para arquivo PFX.`;
    } else {
        message = 'Senha vazia.';
    }

    dialogMessage(message, 0);
});

services.eventEmitter.on('falseConvert', () => {
    const message = 'Arquivo do tipo invalido.';

    dialogMessage(message, 0);
});

services.eventEmitter.on('filesDoNotMatch', () => {
    const message = 'Os arquvios .CRT e .KEY não correspondentes entre si, verifique a origem de cada!';

    dialogMessage(message, 0);
});

services.eventEmitter.on('Sucess', (data) => {
    const message = data.certificadoFilePath ?
        `Conversão realizada com sucesso.\nSalvo em:\n${data.certificadoFilePath}` :
        `Conversão realizada com sucesso.\nSalvo em:\n${data.pfxFilePath}`;

    dialogMessage(message, 1);
});