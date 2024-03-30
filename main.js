const { app, BrowserWindow } = require('electron');
const openssl = require('openssl-wrapper');

function convertPFXtoCRTKEY(pfxPath, password) {
  return new Promise((resolve, reject) => {
    openssl.pfx2pem(pfxPath, password, (err, cert, key) => {
      if (err) {
        reject(err);
      } else {
        resolve({ cert, key });
      }
    });
  });
}

function createWindow() {
  const win = new BrowserWindow({ width: 800, height: 600 });

  win.loadFile('index.html');

  win.webContents.on('did-finish-load', async () => {
    const result = await convertPFXtoCRTKEY('path/to/pfx.pfx', 'password');
    win.webContents.send('pfx-converted', result);
  });
  ;
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

