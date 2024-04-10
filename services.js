const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
function convertPfxToCrt(pfxFilePath, pfxFileName, pfxKeyFilePath, pfxKeyFileName) {

  if (isPfx(pfxFileName) && isKey(pfxKeyFileName)) {
    console.log('cu');

  } else {
    console.log('MOSTRA POP UP DE AVISO ARQUIVO INVALIDO .PFX', pfxFileName, pfxKeyFileName);
    eventEmitter.emit('invalidFile', { pfxFileName, pfxKeyFileName });
    return;
  }
}


function isPfx(pfxInput) {
  if (pfxInput != undefined && pfxInput != null) {
    if (pfxInput.endsWith(".pfx")) {
      return true;
    }
  }
}

function isKey(keyInput) {
  if (keyInput != undefined && keyInput != null) {
    if (keyInput.endsWith(".key")) {
      return true;
    }
  }
}

function isCrt(crtInput) {
  if (crtInput != undefined && crtInput != null) {
    if (crtInput.endsWith(".crt")) {
      return true;
    }
  }
}


module.exports = {
  convertPfxToCrt: convertPfxToCrt,
  eventEmitter: eventEmitter

};