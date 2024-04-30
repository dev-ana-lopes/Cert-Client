'use strict';
const electronApp = require('electron').app;
const electronBrowserWindow = require('electron').BrowserWindow;
const electronIpcMain = require('electron').ipcMain;
const nodePath = require("path");
const services = require('./services');
const { dialog } = require('electron');

let window;

function createWindow() {
    try {
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
    } catch (error) {
        console.error('Erro ao criar janela:', error);
    }
}

electronApp.on('ready', () => {
    try {
        window = createWindow();
    } catch (error) {
        console.error('Erro ao iniciar aplicativo:', error);
    }
});

electronApp.on('window-all-closed', () => {
    try {
        if (process.platform !== 'darwin') {
            electronApp.quit();
        }
    } catch (error) {
        console.error('Erro ao fechar todas as janelas:', error);
    }
});

electronApp.on('activate', () => {
    try {
        if (electronBrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    } catch (error) {
        console.error('Erro ao ativar aplicativo:', error);
    }
});

electronIpcMain.on('verifyPfxToCrt', (event, files) => {
    try {
        const { pfxFilePath, pfxFileName, pfxPassword } = files;
       
        console.log('\nLOG:', pfxFilePath,'\nLOG:', pfxFileName,'\nLOG:', pfxPassword);

        services.checkToConvertPfxToCrt(pfxFilePath, pfxFileName, pfxPassword);
    } catch (error) {
        console.error('Erro ao verificar PFX para CRT:', error);
    }
});

electronIpcMain.on('verifyCrtToPfx', (event, files) => {
    try {
        const { crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, crtPassword } = files;
        
        console.log('\nLOG:', crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, crtPassword);

        services.checkToConvertCrtToPfx(crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, crtPassword);
    } catch (error) {
        console.error('Erro ao verificar CRT para PFX:', error);
    }
});

electronIpcMain.on('verifyInputs', () => {
    dialog.showMessageBox({
        title: 'Aviso !!',
        message: 'Verifique se os arquivos estão adicionados corretamente',
        buttons: ['OK']
    });
});

services.eventEmitter.on('invalidFile', (data) => {
    const message = data.crtFileName && data.crtKeyFileName ?
    `A entrada espera receber um .CRT, mas esta recebendo o tipo: ${data.crtFileName}
     \ne a entrada espera receber um .KEY mas esta recebendo o tipo: ${data.crtKeyFileName}` :
    `A entrada espera receber um .PFX, mas esta recebendo o tipo: ${data.pfxFileName}`;

    dialog.showMessageBox(null, {
        title: 'Arquivo Inválido',
        message: message,
        buttons: ['OK']
    });
});

services.eventEmitter.on('invalidPassword', (data) => {
    let message;
    if (data.pfxPassword) {
        message = `Este arquivo esperava uma senha, mas a senha digitada inválida para arquivo PFX:`;
    } else {
        message = 'Senha vazia !!';
    }

    dialog.showMessageBox(null, {
        title: 'Senha Inválida',
        message: message,
        buttons: ['OK'],
    });
});

services.eventEmitter.on('duplicate', (data) => {
    console.log("\nDATA:0",data);
    const message = data.crtFileName && data.crtKeyFileName ?
    `Você já fez uma conversão usando o arquivo ${data.crtFileName} e ${data.crtKeyFileName} para gerar um arquivo PFX !!!` :
    `Você já fez uma conversão usando o arquivo ${data.pfxFileName} para gerar um arquivo CRT e KEY !!!`;
   
    dialog.showMessageBox(null, {
        title: 'Aviso',
        message: message,
        buttons: ['OK'],
    });
});

services.eventEmitter.on('falseConvert', () => {
    console.log("\nFalseConvert:");

    dialog.showMessageBox(null, {
        title: 'Aviso',
        message: 'Erro arquivo do tipo invalido',
        buttons: ['OK'],
    });
});