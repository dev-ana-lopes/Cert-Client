const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const forge = require('node-forge');
const fs = require('fs');

function convertPfxToCrt(pfxFilePath, pfxFileName, pfxPassaword) {
  console.clear();
  console.log('\nEntrou na service');
  console.log("\n",pfxFilePath, pfxFileName, pfxPassaword);

  if (isPfx(pfxFileName)) {
    covertPfx(pfxFilePath, pfxFileName, pfxPassaword);
  } else {
    console.log('MOSTRA POP UP DE AVISO ARQUIVO INVALIDO .PFX', pfxFileName);
    eventEmitter.emit('invalidFile', { pfxFileName});
    return;
  }
}

function convertCrtToPfx(crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName) {
  if (isCrt(crtFileName) && isKey(crtKeyFileName)) {

  } else {
    console.log('MOSTRA POP UP DE AVISO ARQUIVO INVALIDO .CRT', crtFileName, crtKeyFileName);
    eventEmitter.emit('invalidFile', { crtFileName, crtKeyFileName });
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

function covertPfx(pfxFilePath, pfxFileName, pfxPassaword){
  console.log('\nEntrou na Converte');

  const pfxData = fs.readFileSync(pfxFilePath);

  console.log("\nLeu data:", pfxData);

  // Decodificar o arquivo PFX
  const pfxAsn1 = forge.asn1.fromDer(pfxData.toString('binary'));
  // Descriptografar o arquivo PFX se uma senha foi fornecida
  const pfx = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, pfxPassaword);

  console.log("\nDescriptogafou");

  // Obter a chave privada e o certificado do arquivo PFX
  const privateKey = pfx.getBags({ bagType: forge.pki.oids.pkcs8ShroundedKeyBag })[forge.pki.oids.pkcs8ShroundedKeyBag][0];
  const certificate = pfx.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag][0];

  console.log("\nObteve a chave privada e o certificado do arquivo PFX");

  console.log("\nPRIVATEKEY --------------------------------------\n\n",privateKey);
  console.log("\nCERTIFICATE --------------------------------------\n\n",certificate);

  // Converter a chave privada e o certificado em strings PEM
  const chavePrivadaPem = forge.pki.privateKeyToPem(privateKey);
  const certificadoPem = forge.pki.certificateToPem(certificate);

  console.log('Chave privada PEM:', chavePrivadaPem);
  console.log('Certificado PEM:', certificadoPem);
}

module.exports = {
  convertPfxToCrt: convertPfxToCrt,
  convertCrtToPfx: convertCrtToPfx,
  eventEmitter: eventEmitter
};