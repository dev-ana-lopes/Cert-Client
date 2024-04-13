'use strict';
const electronApp = require('electron').app;
const electronBrowserWindow = require('electron').BrowserWindow;
const electronIpcMain = require('electron').ipcMain;
const nodePath = require("path");
const services = require('./services');

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

services.eventEmitter.on('invalidFile', (data) => {
    console.log('\nMOSTRA POP UP DE AVISO');
    if (data.crtFileName && data.crtKeyFileName) {
        console.log('\nArquivo invalido do tipo CRT:', data.crtFileName, 'e KEY:', data.crtKeyFileName);
    } else {
        console.log('\nArquivo invalido do tipo PFX:', data.pfxFileName);
    }
});

services.eventEmitter.on('invalidPassword', (data) => {
    console.log('\nMOSTRA POP UP DE AVISO');
    if (data.pfxPassword) {
        console.log('\nSenha invalida para arquivo PFX:', data.pfxPassword);
    } else if (data.crtPassword) {
        console.log('\nSenha invalida para arquivo CRT:', data.crtPassword);
    } else {
        console.log('\nSenha vazia invalida');
    }
})