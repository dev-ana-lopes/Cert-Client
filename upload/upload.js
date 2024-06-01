let pfxForButton;
let crtForButton;
let keyForButton;
let validFiles = [];

const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const imgUpload = document.getElementById('imgUpload');

const span1 = document.getElementById('span1');
const span2 = document.getElementById('span2');

const fonte = document.getElementById('fonte');
const fonte2 = document.getElementById('fonte2');

const selectedOption = localStorage.getItem('selectedOption');

const dropArea = document.getElementById('dropArea');

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('docs').addEventListener('click', function (event) {
        event.preventDefault();
        window.open('https://github.com/dev-ana-lopes/Cert-Client', '_blank');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const selectedOption = localStorage.getItem('selectedOption');
    console.log(selectedOption);
});

document.addEventListener("DOMContentLoaded", function () {
    insertText();
});

document.getElementById('pfxInput').addEventListener('change', function (event) {
    pfxForButton = event.target.files;
    console.log("PfxList",pfxForButton);
    updateFileInput(pfxForButton);
});

document.getElementById('crtInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const extension = getExtension(file.name);

    if (extension === '.crt') {
        crtForButton = file;
    } else if (extension === '.key') {
        keyForButton = file;
    }

    console.log('Arquivo CRT:', crtForButton);
    console.log('Arquivo KEY:', keyForButton);
    updateFileInput([crtForButton, keyForButton]);
});
 

document.addEventListener("DOMContentLoaded", function () {
    insertText();
});


dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('dragover');

    const files = event.dataTransfer.files;
    handleFiles(files);
});


function insertText() {
    document.getElementById("output").innerHTML = typeConvert();
}

function typeConvert() {
    if (selectedOption === 'pfx-crtkey') {
        return 'Conversão do PFX para CRT + KEY';
    }
    return 'Conversão do CRT + KEY para PFX';
}

function getPassword() {
    return document.getElementById('password').value;
}

function getExtension(fileName) {
    return fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
}

function openInputFiles() {
    if (selectedOption === 'pfx-crtkey') {
        console.log('Opção selecionada: PFX para CRT + KEY');
        pfxForButton = document.getElementById('pfxInput').click();
    } else if (selectedOption === 'crtkey-pfx') {
        console.log('Opção selecionada: CRT + KEY para PFX');
        document.getElementById('crtInput').click();
    }
}

function updateFileInput(files) {
    if (selectedOption === 'pfx-crtkey') {
        validFiles = files;
    } else {
        validFiles = files.filter(file => file !== undefined);
    }

    console.log("Arquvios updateFileInput:", validFiles);

    hiddenDropArea(validFiles, selectedOption);
}

function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = getExtension(file.name);

        if (!isValidFile(file, selectedOption, validFiles, fileExtension)) {
            continue;
        }

        validFiles.push(file);
        console.log(`Arquivo solto: ${file.name}`);
    }

    console.log("Arquivos válidos em handleFiles:", validFiles);
    hiddenDropArea(validFiles, selectedOption);
}

function isValidFile(file, selectedOption, validFiles, fileExtension) {
    const allowedExtensions = selectedOption === 'pfx-crtkey' ? ['.pfx'] : ['.crt', '.key'];
    const existingIndex = validFiles.findIndex(existingFile => existingFile.name.substring(existingFile.name.lastIndexOf('.')).toLowerCase() === fileExtension);

    if (!allowedExtensions.includes(fileExtension)) {
        console.log(`Arquivo não permitido: ${file.name}`);
        return false;
    }

    if (selectedOption === 'pfx-crtkey' && existingIndex !== -1) {
        validFiles[existingIndex] = file;
        console.log('Já existe um arquivo .pfx. Substituindo...', file);
        return false;
    }

    if (selectedOption !== 'pfx-crtkey') {
        const crtIndex = validFiles.findIndex(existingFile => existingFile.name.toLowerCase().endsWith('.crt'));
        const keyIndex = validFiles.findIndex(existingFile => existingFile.name.toLowerCase().endsWith('.key'));

        if (fileExtension === '.crt' && crtIndex !== -1) {
            console.log('Já existe um arquivo .crt. Substituindo...');
            validFiles[crtIndex] = file;
            console.log('Já existe um arquivo .crt. Substituindo...', file);
            return false;
        }

        if (fileExtension === '.key' && keyIndex !== -1) {
            validFiles[keyIndex] = file;
            console.log('Já existe um arquivo .key. Substituindo...', file);
            return false;
        }
    }

    return true;
}

function hiddenDropArea(validFiles, selectedOption) {
    emptyArea();

    if (validFiles.length === 1) {
        showSingleFile();
        
    } else if (validFiles.length === 2 && selectedOption === 'crtkey-pfx') {
        showPairFile();
    }
}

function showSingleFile() {
    img1.style.display = 'block';
    span1.innerText = validFiles[0].name;
}

function showPairFile() {
    img1.style.display = 'block';
    img2.style.display = 'block';
    span1.innerText = validFiles[0].name;
    span2.innerText = validFiles[1].name;
}

function emptyArea() {
    imgUpload.style.display = 'none';
    fonte.style.display = 'none';
    fonte2.style.display = 'none';
}

function notEmptyArea() {
    img1.style.display = 'none';
    img2.style.display = 'none';
    imgUpload.style.display = 'block';
    fonte.style.display = 'block';
    fonte2.style.display = 'block';
    span1.innerText = '';
    span2.innerText = '';
}

function clearPassword() {
    document.getElementById('password').value = '';
}

function chooseFileSendMain() { 
    const password = getPassword();

    if (selectedOption === 'pfx-crtkey') {
        sendPfxToMain(password);

    } else {
        sendCrtKeyToMain(password);
    }

    validFiles = [];
    notEmptyArea();
    clearPassword();
}

function sendPfxToMain(password) {
    const pfxFilePath = validFiles[0].path;
    const pfxFileName = validFiles[0].name;

    window.ipcRender.send('verifyPfxToCrt', {
        pfxFilePath,
        pfxFileName,
        password
    });
}

function sendCrtKeyToMain(password) {
    const crtFile = validFiles.find(file => file.name.endsWith('.crt'));
    const crtKeyFile = validFiles.find(file => file.name.endsWith('.key'));

    const crtFilePath = crtFile.path;
    const crtFileName = crtFile.name;
    const crtKeyFilePath = crtKeyFile.path;
    const crtKeyFileName = crtKeyFile.name;

    window.ipcRender.send('verifyCrtToPfx', {
        crtFilePath,
        crtFileName,
        crtKeyFilePath,
        crtKeyFileName,
        password
    });
}



