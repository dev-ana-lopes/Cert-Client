function startConvertPfxToCrt() {
    const pfxFile = document.getElementById('pfxInput').files[0];
    const pfxPassword = document.getElementById('pfxPassword').value;

    const pfxFilePath = pfxFile ? pfxFile.path : null;
    const pfxFileName = pfxFile ? pfxFile.name : null;

    if (pfxFile) {
        window.ipcRender.send('verifyPfxToCrt', { 
            pfxFilePath,
            pfxFileName,
            pfxPassword
        });

        document.getElementById('pfxInput').value = '';
        document.getElementById('pfxPassword').value = '';
    } else {
        window.ipcRender.send('verifyInputs');
    }
}

function startConvertCrtAndKeyToPfx() {
    const crtFile = document.getElementById('crtInput').files[0];
    const crtKeyFile = document.getElementById('crtKeyInput').files[0];
    const crtPassword = document.getElementById('crtPassword').value;

    const crtFilePath =  crtFile !== undefined ? crtFile.path : null;
    const crtFileName =  crtFile !== undefined ? crtFile.name : null;
    const crtKeyFilePath = crtKeyFile ? crtKeyFile.path : null;
    const crtKeyFileName = crtKeyFile ? crtKeyFile.name : null;

    if (crtFile && crtKeyFile) {
        window.ipcRender.send('verifyCrtToPfx', {
            crtFilePath,
            crtFileName,
            crtKeyFilePath,
            crtKeyFileName,
            crtPassword
        });

        document.getElementById('crtInput').value = '';
        document.getElementById('crtKeyInput').value = '';
        document.getElementById('crtPassword').value = '';
    } else {
      window.ipcRender.send('verifyInputs');
    }
}