const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const forge = require('node-forge');

function checkToConvertPfxToCrt(pfxFilePath, pfxFileName, pfxPassword) {
  if (isPfx(pfxFileName)) {
    convertPfx(pfxFilePath, pfxFileName, pfxPassword);
  } else {
    eventEmitter.emit('invalidFile', { pfxFileName });
  }
}

function checkToConvertCrtToPfx(crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, crtPassword) {
  if (isCrt(crtFileName) && isKey(crtKeyFileName)) {
    convertCrt(crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName,crtPassword);
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

// --------------------------------------------------------------------------- 
// adicionar o await na validação senha. <3
function readFile(filePath) {
  return fs.readFileSync(filePath);
}

function parsePfxData(pfxData, pfxPassword) {
  console.log('\nConvertendo certificado para formato compreensivel...');
  let pfxAsn1;
  try {
    pfxAsn1 = forge.asn1.fromDer(pfxData.toString('binary'));
  } catch (ex) {
    eventEmitter.emit('falseConvert');
  }

  try {
    return forge.pkcs12.pkcs12FromAsn1(pfxAsn1, pfxPassword);
  } catch(ex) {
    if (ex.message.includes('PKCS#12 MAC could not be verified')) {
      return eventEmitter.emit('invalidPassword', {pfxPassword});
    } 
  }
}

function extractPrivateKeyAndCertificate(pfx) {
  console.log('\nCriando arquivo CRT e KEY...');
  const privateKeyBag = pfx.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[forge.pki.oids.pkcs8ShroudedKeyBag][0];
  const certificateBag = pfx.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag][0];

  if (!privateKeyBag || !certificateBag) {
    throw new Error('Chave privada ou certificado não encontrados no arquivo PFX');
  }

  const privateKey = privateKeyBag.key;
  const certificate = certificateBag.cert;

  return { privateKey, certificate };
}

function saveCrtAndKeyFiles(folderPath, pfxFileName, certificadoPem, chavePrivadaPem) {
  const certificadoFilePath = path.join(folderPath, `${pfxFileName.replace(/\.pfx$/, '')}.crt`);
  const chavePrivadaFilePath = path.join(folderPath, `${pfxFileName.replace(/\.pfx$/, '')}.key`);

  if (fs.existsSync(certificadoFilePath) || fs.existsSync(chavePrivadaFilePath)) {
    if (fs.existsSync(certificadoFilePath) && fs.existsSync(chavePrivadaFilePath)) {
      console.log("\n",`Nao foi possivel salvar ${certificadoFilePath} porque o arquivo ja existe.`);
      console.log("\n",`Nao foi possivel salvar ${chavePrivadaFilePath} porque o arquivo ja existe.`);
      eventEmitter.emit('duplicate',{pfxFileName});
      return; 
    } 
  }

  console.log('\nSalvando arquivo CRT...');
  fs.writeFileSync(certificadoFilePath, certificadoPem);

  console.log('\nSalvando arquivo PFX...');
  fs.writeFileSync(chavePrivadaFilePath, chavePrivadaPem);

  console.log('\nCertificado salvo em:', certificadoFilePath);
  console.log('\nChave privada salva em:', chavePrivadaFilePath);
}

function convertPfx(pfxFilePath, pfxFileName, pfxPassword) {
  console.log('\nIniciando conversao de PFX para CRT e KEY...');
  const folderPath = createFolder();

  console.log('\nLendo arquivo PFX...');
  const pfxData = readFile(pfxFilePath);

  const pfx = parsePfxData(pfxData, pfxPassword);

  if (pfx === null || pfx === undefined || pfx === true) {
    return;
  }
  console.log("\nHHHHHHHH",pfx)
  const { privateKey, certificate } = extractPrivateKeyAndCertificate(pfx);
  const certificadoPem = forge.pki.certificateToPem(certificate);
  const chavePrivadaPem = forge.pki.privateKeyToPem(privateKey);
  saveCrtAndKeyFiles(folderPath, pfxFileName, certificadoPem, chavePrivadaPem);
}


// --------------------------------------------------------------------------- 


function convertToPemObjects(crtData, keyData) {
  console.log('\nConvertendo certificado para formato compreensivel...');
  const certificate = forge.pki.certificateFromPem(crtData.toString());
  const privateKey = forge.pki.privateKeyFromPem(keyData.toString());
  return {certificate, privateKey};
}

function createPfxDer(privateKey, certificate, crtPassword) {
  console.log('\nCriando arquivo PFX...');
  const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
    privateKey,
    certificate,
    crtPassword
  );

  return forge.asn1.toDer(p12Asn1).getBytes();
}

function savePfxFile(p12Der, folderPath, crtFileName, crtKeyFileName) {
  const pfxFilePath = path.join(folderPath, `${crtFileName.replace(/\.crt$/, '')}.pfx`);
  
  if (fs.existsSync(pfxFilePath)) {
    console.log(`Nao foi possivel salvar ${pfxFilePath} porque o arquivo ja existe.`);
    eventEmitter.emit('duplicate',{ crtFileName, crtKeyFileName });
    return;
  }

  console.log('\nSalvando arquivo PFX...');
  fs.writeFileSync(pfxFilePath, p12Der, 'binary');

  console.log('\nPFX salvo em:', pfxFilePath);
}

function convertCrt(crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, crtPassword) {
  console.log('\nIniciando conversao de CRT para PFX...');
  
  const folderPath = createFolder();

  console.log('\nLendo arquivo CRT...');
  const crtData = readFile(crtFilePath);
  
  console.log('\nLendo arquivo KEY...');
  const keyData = readFile(crtKeyFilePath);

  const { certificate, privateKey } =  convertToPemObjects(crtData, keyData);

  const p12Der = createPfxDer(privateKey, certificate, crtPassword);
  
  savePfxFile(p12Der, folderPath, crtFileName, crtKeyFileName);
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