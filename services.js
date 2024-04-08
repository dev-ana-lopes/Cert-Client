const exec  = require('child_process');
const os = require('os');
const path = require('path');

function convertPfxToCrt() {
    const pfxInput = document.getElementById('pfxInput').files[0];
    const keyInput = document.getElementById('pfxKeyInput').files[0];
    
    let firtArg;
    let newTitleCrt;
    
    if(isPfx(pfxInput)){
      firtArg = pfxInput.path;
      newTitleCrt = pfxInput.name
    } else {
      console.log( 'MOSTRA POP UP DE AVISO ARQUIVO INVALIDO .PFX');
      return;
    }

    if (isKey(keyInput)){
      var secondArg = keyInput.path;
    } else {
        console.log( 'MOSTRA POP UP DE AVISO ARQUIVO INVALIDO .KEY');
        return;
      }

    console.log(firtArg,secondArg);
    
    const commandPfxToCrt = `openssl pkcs12 -in "${firtArg}" -clcerts -nokeys -out ${newTitleCrt}`;

    corvertPfx(commandPfxToCrt);    
  }

  function convertCrtAndKeyToPfx() {
    const crtInput = document.getElementById('crtInput').files[0];
    const keyInput = document.getElementById('crtKeyInput').files[0];
    
    console.log(crtInput);
    console.log(keyInput);

    let firtArg;
    
  }

  function isPfx(pfxInput){
    if(pfxInput != undefined && pfxInput != null){
      if  (pfxInput.name.endsWith(".pfx")) {
        return true;
      } 
    }
  }

  function isKey(keyInput){
    if(keyInput != undefined && keyInput != null){
        if  (keyInput.name.endsWith(".key")) {
          return true;
        } 
    }
  }

  function isCrt(crtInput){
    if(crtInput != undefined && crtInput != null){
        if  (crtInput.name.endsWith(".crt")) {
          return true;
        } 
    }
  }

  function corvertPfx(commandPfxToCrt){
    const desktopDir = path.join(os.homedir(), 'Desktop');
    process.chdir(desktopDir);
    
   
    exec(commandPfxToCrt, (erro, stdout, stderr) => {
      if (erro) {
        console.error(`Ocorreu um erro: ${erro}`);
        return;
      }
      console.log(`Saída do terminal: ${stdout}`);
    });
  }