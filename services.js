const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const forge = require('node-forge');

function checkToConvertPfxToCrt(pfxFilePath, pfxFileName, pfxPassword) {
  if (isPfx(pfxFileName)) {
    covertPfx(pfxFilePath, pfxFileName, pfxPassword);
  } else {
    eventEmitter.emit('invalidFile', { pfxFileName });
  }
}

function checkToConvertCrtToPfx(crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, crtPassword) {
  if (isCrt(crtFileName) && isKey(crtKeyFileName)) {
    covertCrt(crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, crtPassword);
  } else {
    eventEmitter.emit('invalidFile', { crtFileName, crtKeyFileName });
  }
}

function isPfx(pfxInput) {
  return pfxInput.endsWith(".pfx");
}

function isKey(keyInput) {
  return keyInput.endsWith(".key");
}

function isCrt(crtInput) {
  return crtInput.endsWith(".crt");
}

// function covertPfx(pfxFilePath, pfxFileName, pfxPassword) {
//   const folderPath = createFolder();

//   const pfxData = fs.readFileSync(pfxFilePath);

//   const pfxAsn1 = forge.asn1.fromDer(pfxData.toString('binary'));
//   let pfx;

//   try {
//     pfx = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, pfxPassword);
//   } catch(ex) {
//     if (ex.message.includes('PKCS#12 MAC could not be verified')) {
//       eventEmitter.emit('invalidPassword', {pfxPassword});
//       return;
//     } 
//   }

//   const privateKeyBag = pfx.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[forge.pki.oids.pkcs8ShroudedKeyBag][0];
//   const certificateBag = pfx.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag][0];

//   if (!privateKeyBag || !certificateBag) {
//     throw new Error('Chave privada ou certificado não encontrados no arquivo PFX');
//   }

//   const privateKey = privateKeyBag.key;
//   const certificate = certificateBag.cert;

//   const chavePrivadaPem = forge.pki.privateKeyToPem(privateKey);
//   const certificadoPem = forge.pki.certificateToPem(certificate);
  
//   const certificadoFilePath = path.join(folderPath, `${pfxFileName.replace(/\.pfx$/, '')}.crt`);
//   const chavePrivadaFilePath = path.join(folderPath, `${pfxFileName.replace(/\.pfx$/, '')}.key`);

//   // const timestamp = new Date().getTime(); 
//   // const uniqueFileNamePrefix = `${pfxFileName.replace(/\.pfx$/, '')}_${timestamp}`;
//   // const certificadoFilePath = path.join(folderPath, `${uniqueFileNamePrefix}.crt`);
//   // const chavePrivadaFilePath = path.join(folderPath, `${uniqueFileNamePrefix}.key`);

//   fs.writeFileSync(certificadoFilePath, certificadoPem);
//   fs.writeFileSync(chavePrivadaFilePath, chavePrivadaPem);

//   console.log('\nCertificado salvo em:', certificadoFilePath);
//   console.log('\nChave privada salva em:', chavePrivadaFilePath);
// }

function readPfxFile(pfxFilePath) {
  return fs.readFileSync(pfxFilePath);
}

function parsePfxData(pfxData, pfxPassword) {
  const pfxAsn1 = forge.asn1.fromDer(pfxData.toString('binary'));
  try {
    return forge.pkcs12.pkcs12FromAsn1(pfxAsn1, pfxPassword);
  } catch(ex) {
    if (ex.message.includes('PKCS#12 MAC could not be verified')) {
      return eventEmitter.emit('invalidPassword', {pfxPassword});
    } 
  }
}

function extractPrivateKeyAndCertificate(pfx) {
  const privateKeyBag = pfx.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[forge.pki.oids.pkcs8ShroudedKeyBag][0];
  const certificateBag = pfx.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag][0];

  if (!privateKeyBag || !certificateBag) {
    throw new Error('Chave privada ou certificado não encontrados no arquivo PFX');
  }

  const privateKey = privateKeyBag.key;
  const certificate = certificateBag.cert;

  return { privateKey, certificate };
}

function saveFiles(folderPath, pfxFileName, certificadoPem, chavePrivadaPem) {
  const certificadoFilePath = path.join(folderPath, `${pfxFileName.replace(/\.pfx$/, '')}.crt`);
  const chavePrivadaFilePath = path.join(folderPath, `${pfxFileName.replace(/\.pfx$/, '')}.key`);

  fs.writeFileSync(certificadoFilePath, certificadoPem);
  fs.writeFileSync(chavePrivadaFilePath, chavePrivadaPem);

  console.log('\nCertificado salvo em:', certificadoFilePath);
  console.log('\nChave privada salva em:', chavePrivadaFilePath);
}

function covertPfx(pfxFilePath, pfxFileName, pfxPassword) {
  const folderPath = createFolder();
  const pfxData = readPfxFile(pfxFilePath);
  const pfx = parsePfxData(pfxData,pfxPassword);

  
  const { privateKey, certificate } = extractPrivateKeyAndCertificate(pfx);
  const certificadoPem = forge.pki.certificateToPem(certificate);
  const chavePrivadaPem = forge.pki.privateKeyToPem(privateKey);
  saveFiles(folderPath, pfxFileName, certificadoPem, chavePrivadaPem);
 
}

function covertCrt(crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, crtPassword) {
  
}

function createFolder() {
  const folderName = "Certificados";

  const pathDesktop = path.join(require('os').homedir(),'Desktop');

  const newPathFolder = path.join(pathDesktop, folderName);

  if(!fs.existsSync(newPathFolder)) {
    fs.mkdirSync(newPathFolder);
  }
  return newPathFolder;
}

module.exports = {
  checkToConvertPfxToCrt,
  checkToConvertCrtToPfx,
  eventEmitter
}