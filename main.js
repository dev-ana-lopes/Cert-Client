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
         window = new electronBrowserWindow({
            width: 1050,
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
        const { pfxFilePath, pfxFileName, password } = files;
       
        console.log('\nLOG:', pfxFilePath,'\nLOG:', pfxFileName,'\nLOG:', password);

        services.checkToConvertPfxToCrt(pfxFilePath, pfxFileName, password);
    } catch (error) {
        console.error('Erro ao verificar PFX para CRT:', error);
    }
});

electronIpcMain.on('verifyCrtToPfx', (event, files) => {
    try {
        const { crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, password } = files;
        
        console.log('\nLOG:', crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, password);

        services.checkToConvertCrtToPfx(crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, password);
    } catch (error) {
        console.error('Erro ao verificar CRT para PFX:', error);
    }
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
    if (data.password) {
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
    dialog.showMessageBox(null, {
        title: 'Aviso',
        message: 'Erro arquivo do tipo invalido',
        buttons: ['OK'],
    });
});

services.eventEmitter.on('filesDoNotMatch', () => {
    dialog.showMessageBox(null, {
        title: 'Aviso',
        message: 'Os arquvios .CRT e .KEY nao correspondentes entre si, verifique a origem de cada!',
        buttons: ['OK'],
    });
});

services.eventEmitter.on('Sucess', (data) => {
    const message =  data.certificadoFilePath ?
    `Conversão realizada com sucesso!!! O arquvio foi salvo em: ${data.certificadoFilePath}` :
    `Conversão realizada com sucesso!!! O arquvio foi salvo em: ${data.pfxFilePath}`;

    dialog.showMessageBox(null, {
        title: 'SUCESSO',
        message: message,
        buttons: ['OK'],
    });
});