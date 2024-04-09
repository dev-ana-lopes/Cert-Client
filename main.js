const { app, BrowserWindow } = require('electron');

function createWindow() {

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 560,
    frame: false, 
    
    webPreferences: {
      nodeIntegration: true 
    }
  });


  mainWindow.loadFile('index.html');
  
  if (process.platform === 'win32') {
    mainWindow.setMenu(null); 
  } else if (process.platform === 'linux') {
    console.log("Linux");
  }
}

app.whenReady().then(createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
   if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

