const fs = require('fs');
const path = require('path');
const os = require('os');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const forge = require('node-forge');

function checkToConvertPfxToCrt(pfxFilePath, pfxFileName, password) {
  if (isPfx(pfxFileName)) {
    convertPfx(pfxFilePath, pfxFileName, password);
  } else {
    eventEmitter.emit('invalidFile', { pfxFileName });
  }
}

function checkToConvertCrtToPfx(crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, password) {
  if (isCrt(crtFileName) && isKey(crtKeyFileName)) {
    try {
      convertCrt(crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, password);
    } catch (Ex) {
      if (Ex.message === "Os arrays sao diferentes.") {
        eventEmitter.emit('filesDoNotMatch');
      }
    }
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

function readFile(filePath) {
  return fs.readFileSync(filePath);
}

function parsePfxData(pfxData, password) {
  let pfxAsn1;
  try {
    pfxAsn1 = forge.asn1.fromDer(pfxData.toString('binary'));
  } catch (ex) {
    eventEmitter.emit('falseConvert');
  }

  try {
    return forge.pkcs12.pkcs12FromAsn1(pfxAsn1, password);
  } catch (ex) {
    if (ex.message.includes('PKCS#12 MAC could not be verified')) {
      return eventEmitter.emit('invalidPassword', { password });
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

function saveCrtAndKeyFiles(folderPath, pfxFileName, certificadoPem, chavePrivadaPem) {
  if (!folderPath || !pfxFileName) {
    return;
  }

  const certificadoFilePath = path.join(folderPath, `${pfxFileName.replace(/\.pfx$/, '')}.crt`);
  const chavePrivadaFilePath = path.join(folderPath, `${pfxFileName.replace(/\.pfx$/, '')}.key`);

  fs.writeFileSync(certificadoFilePath, certificadoPem);

  fs.writeFileSync(chavePrivadaFilePath, chavePrivadaPem);

  eventEmitter.emit('Sucess', { certificadoFilePath });
}

function convertPfx(pfxFilePath, pfxFileName, password) {
  const folderPath = createFolder();
  if (!folderPath) {
    return;
  }

  const pfxData = readFile(pfxFilePath);

  const pfx = parsePfxData(pfxData, password);

  if (pfx === null || pfx === undefined || pfx === true) {
    return;
  }

  const { privateKey, certificate } = extractPrivateKeyAndCertificate(pfx);
  const certificadoPem = forge.pki.certificateToPem(certificate);
  const chavePrivadaPem = forge.pki.privateKeyToPem(privateKey);
  saveCrtAndKeyFiles(folderPath, pfxFileName, certificadoPem, chavePrivadaPem);
}


// --------------------------------------------------------------------------- 


function convertToPemObjects(crtData, keyData) {
  const certificate = forge.pki.certificateFromPem(crtData.toString());
  const privateKey = forge.pki.privateKeyFromPem(keyData.toString());
  checkedFilesCorrespondence(certificate, privateKey);

  return { certificate, privateKey };
}

function createPfxDer(privateKey, certificate, password) {
  const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
    privateKey,
    certificate,
    password
  );

  return forge.asn1.toDer(p12Asn1).getBytes();
}

function savePfxFile(p12Der, folderPath, crtFileName, crtKeyFileName) {
  const pfxFilePath = path.join(folderPath, `${crtFileName.replace(/\.crt$/, '')}.pfx`);

  if (fs.existsSync(pfxFilePath)) {
    eventEmitter.emit('duplicate', { crtFileName, crtKeyFileName });
    return;
  }

  fs.writeFileSync(pfxFilePath, p12Der, 'binary');
  eventEmitter.emit('Sucess', { pfxFilePath });
}

function convertCrt(crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, password) {
  const folderPath = createFolder();

  const crtData = readFile(crtFilePath);

  const keyData = readFile(crtKeyFilePath);

  const { certificate, privateKey } = convertToPemObjects(crtData, keyData);
  const p12Der = createPfxDer(privateKey, certificate, password);

  savePfxFile(p12Der, folderPath, crtFileName, crtKeyFileName);
}

function checkedFilesCorrespondence(certificate, privateKey) {
  const arrayCert = extractArray(certificate.publicKey.n);
  const arrayKey = extractArray(privateKey.n);

  isSomeLength(arrayCert, arrayKey);

  const isEquals = arrayCert.map((elementoCert, indice) => elementoCert === arrayKey[indice]);

  if (!isEquals.every(e => e === true)) {
    throw Error("Os arrays sao diferentes.");
  }
}

function extractArray(objeto) {
  if (objeto && objeto.data && Array.isArray(objeto.data)) {
    return objeto.data;
  }
}

function isSomeLength(arrayCert, arrayKey) {
  if (arrayCert.length !== arrayKey.length) {
    return;
  }
}

function getOperatingSystem() {
  const platform = os.platform();

  switch (platform) {
    case 'win32':
      return 'Windows';
    case 'linux':
      return 'Linux';
  }
}

function createFolder() {
  let system = getOperatingSystem();

  if (system === 'Windows') {
    return createFolderWin();
  } else if (system === 'Linux') {
    return createFolderLinux();
  }
}

function createFolderWin() {
  const folderName = "Certificados";
  const pathDesktop = path.join(require('os').homedir(), 'Desktop');
  const newPathFolder = path.join(pathDesktop, folderName);

  try {
    if (!fs.existsSync(newPathFolder)) {
      fs.mkdirSync(newPathFolder);
      return newPathFolder;
    }
  } catch (error) {
    const pathDownloads = path.join(require('os').homedir(), 'Downloads');
    const newPathFolderDownloads = path.join(pathDownloads, folderName);

    try {
      if (!fs.existsSync(newPathFolderDownloads)) {
        fs.mkdirSync(newPathFolderDownloads);
        return newPathFolderDownloads;
      }
    } catch (err) {
      return null;
    }
  }
  return newPathFolder;
}


function createFolderLinux() {
  const folderName = "Certificados";
  const userHome = process.env.HOME || process.env.USERPROFILE;
  if (!userHome) {
    return null;
  }

  const pathDocuments = path.join(userHome, 'Documents');
  const newPathFolder = path.join(pathDocuments, folderName);

  try {
    if (!fs.existsSync(newPathFolder)) {
      fs.mkdirSync(newPathFolder);
      return newPathFolder;
    } else {
      return newPathFolder;

    }
  } catch (err) {
    try {
      const pathDownloads = path.join(userHome, 'Downloads');
      const newPathFolderDownloads = path.join(pathDownloads, folderName);

      if (!fs.existsSync(newPathFolderDownloads)) {
        fs.mkdirSync(newPathFolderDownloads);
        return newPathFolderDownloads;
      } else {
        return newPathFolderDownloads;
      }
    } catch (err) {
      console.error('Erro ao criar a pasta na pasta de downloads:', err);
    }
  }
}


module.exports = {
  checkToConvertPfxToCrt,
  checkToConvertCrtToPfx,
  eventEmitter
}