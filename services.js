const fs = require('fs');
const path = require('path');
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
      if(Ex.message === "Os arrays sao diferentes.") {
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
  console.log('\nConvertendo certificado para formato compreensivel...');
  console.log("\nPfxData:", pfxData,"\nSenha:",password);
  let pfxAsn1;
  try {
    pfxAsn1 = forge.asn1.fromDer(pfxData.toString('binary'));
  } catch (ex) {
    eventEmitter.emit('falseConvert');
  }
  console.log("\nConverteu para binary:",pfxAsn1);
  try {
    return forge.pkcs12.pkcs12FromAsn1(pfxAsn1, password);
  } catch(ex) {
    if (ex.message.includes('PKCS#12 MAC could not be verified')) {
      return eventEmitter.emit('invalidPassword', {password});
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

function convertPfx(pfxFilePath, pfxFileName, password) {
  console.log('\nIniciando conversao de PFX para CRT e KEY...');
  const folderPath = createFolder();

  console.log('\nLendo arquivo PFX...');
  const pfxData = readFile(pfxFilePath);

  const pfx = parsePfxData(pfxData, password);

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
  console.log('\nConvertendo certificado para formato compreensível...');

  const certificate = forge.pki.certificateFromPem(crtData.toString());
  const privateKey = forge.pki.privateKeyFromPem(keyData.toString());
  checkedFilesCorrespondence(certificate, privateKey);

  return { certificate, privateKey };
}

function createPfxDer(privateKey, certificate, password) {
  console.log('\nCriando arquivo PFX...');
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
    console.log(`Nao foi possivel salvar ${pfxFilePath} porque o arquivo ja existe.`);
    eventEmitter.emit('duplicate',{ crtFileName, crtKeyFileName });
    return;
  }

  console.log('\nSalvando arquivo PFX...');
  fs.writeFileSync(pfxFilePath, p12Der, 'binary');

  console.log('\nPFX salvo em:', pfxFilePath);
}

function convertCrt(crtFilePath, crtFileName, crtKeyFilePath, crtKeyFileName, password) {
  console.log('\nIniciando conversao de CRT para PFX...');
  
  const folderPath = createFolder();

  console.log('\nLendo arquivo CRT...');
  const crtData = readFile(crtFilePath);
  
  console.log('\nLendo arquivo KEY...');
  const keyData = readFile(crtKeyFilePath);

  const { certificate, privateKey } =  convertToPemObjects(crtData, keyData);
  const p12Der = createPfxDer(privateKey, certificate, password);
  
  savePfxFile(p12Der, folderPath, crtFileName, crtKeyFileName);
}

function checkedFilesCorrespondence(certificate, privateKey) {
  const arrayCert = extractArray(certificate.publicKey.n);
  const arrayKey = extractArray(privateKey.n);
  
  isSomeLength(arrayCert, arrayKey);

  const isEquals = arrayCert.map((elementoCert, indice) => elementoCert === arrayKey[indice]);

  if (!isEquals.every(e => e === true)) {
    console.log("Os arrays sao diferentes.");
    throw Error("Os arrays sao diferentes.");
  } 
}

function extractArray(objeto) {
  if (objeto && objeto.data && Array.isArray(objeto.data)) {
    console.log("\nArray:", objeto.data);
    return objeto.data;
  }
}

function isSomeLength(arrayCert, arrayKey) {
  if (arrayCert.length !== arrayKey.length) {
    console.log("Os arrays têm comprimentos diferentes.");
    return;
  }
}

function createFolder() {
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
      console.error('Erro ao criar o diretório Certificados na pasta de Downloads:', err.message);
      return null;
    }
  }
  return newPathFolder;
}

module.exports = {
  checkToConvertPfxToCrt,
  checkToConvertCrtToPfx,
  eventEmitter
}