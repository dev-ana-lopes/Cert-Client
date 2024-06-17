let pfxForButton;
let crtForButton;
let keyForButton;
let validFiles = [];

const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const imgUpload = document.getElementById('imgUpload');

const span1 = document.getElementById('span1');
const span2 = document.getElementById('span2');

const close1 = document.getElementById('close1');

const fonte = document.getElementById('fonte');
const fonte2 = document.getElementById('fonte2');

const selectedOption = localStorage.getItem('selectedOption');

const dropArea = document.getElementById('docsArea');

document.getElementById('docsArea').addEventListener('click', openInputFiles);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('docs').addEventListener('click', function (event) {
        event.preventDefault();
        window.open('https://github.com/dev-ana-lopes/Cert-Client', '_blank');
    });
});

document.addEventListener("DOMContentLoaded", function () {
    insertText();
});

document.getElementById('pfxInput').addEventListener('change', function (event) {
    pfxForButton = event.target.files;
    updateFileInput(pfxForButton);
});

document.getElementById('crtInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const extension = getExtension(file);
    if (extension === '.crt') {
        crtForButton = file;
    }  else if (extension === '.key') {
        keyForButton = file;
    }

    updateFileInput([crtForButton, keyForButton]);
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

    if (files.length === 0) {
        console.error('Nenhum arquivo solto. Verifique as permissões e tente novamente.');
    } else {
        handleFiles(files);
    }
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

function getExtension(file) {
    return file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
}

function openInputFiles() {
    document.getElementById('pfxInput').value = '';
    document.getElementById('crtInput').value = '';

    if (selectedOption === 'pfx-crtkey') {
        document.getElementById('pfxInput').click();
    } else if (selectedOption === 'crtkey-pfx') {
        document.getElementById('crtInput').click();
    }
}

function updateFileInput(files) {
    if (selectedOption === 'pfx-crtkey') {
        validFiles = files;
    } else {
        validFiles = files.filter(file => file !== undefined);
    }

    hiddenDropArea(validFiles, selectedOption);
}

function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = getExtension(file);

        if (!isValidFile(file, selectedOption, validFiles, fileExtension)) {
            continue;
        }

        validFiles.push(file);
    }

    if (validFiles.length !== 0) {
        hiddenDropArea(validFiles, selectedOption);
    } 
}

function isValidFile(file, selectedOption, validFiles, fileExtension) {
    const allowedExtensions = selectedOption === 'pfx-crtkey' ? ['.pfx'] : ['.crt', '.key'];
    const existingIndex = validFiles.findIndex(existingFile => existingFile.name.substring(existingFile.name.lastIndexOf('.')).toLowerCase() === fileExtension);

    if (!allowedExtensions.includes(fileExtension)) {
        return false;
    }

    if (selectedOption === 'pfx-crtkey' && existingIndex !== -1) {
        validFiles[existingIndex] = file;
        return false;
    }

    if (selectedOption !== 'pfx-crtkey') {
        const crtIndex = validFiles.findIndex(existingFile => existingFile.name.toLowerCase().endsWith('.crt'));
        const keyIndex = validFiles.findIndex(existingFile => existingFile.name.toLowerCase().endsWith('.key'));

        if (fileExtension === '.crt' && crtIndex !== -1) {
            validFiles[crtIndex] = file;
            return false;
        }

        if (fileExtension === '.key' && keyIndex !== -1) {
            validFiles[keyIndex] = file;
            return false;
        }
    }

    return true;
}

function hiddenDropArea(validFiles, selectedOption) {
    emptyArea();

    if (validFiles.length === 1) {
        showSingleFile();
        validate();
    } else if (validFiles.length === 2 && selectedOption === 'crtkey-pfx') {
        showPairFile();
        validate();
    }
}

function showSingleFile() {
    img1.style.display = 'block';
    span1.innerText = validFiles[0].name;
    styleCloseBtn();
}

function showPairFile() {
    img1.style.display = 'block';
    img2.style.display = 'block';
    span1.innerText = validFiles[0].name;
    span2.innerText = validFiles[1].name;
    styleCloseBtn();
}

function emptyArea() {
    imgUpload.style.display = 'none';
    fonte.style.display = 'none';
    fonte2.style.display = 'none';
}

function notEmptyArea() {
    img1.style.display = 'none';
    img2.style.display = 'none';
    close1.style.display = 'none';
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
    const convertBtn = document.getElementById('convert');

    if (selectedOption === 'pfx-crtkey') {
        sendPfxToMain(password);
    } else {
        sendCrtKeyToMain(password);
    }
    
    validFiles = [];
    pfxForButton = undefined;
    crtForButton = undefined;
    keyForButton = undefined;
    convertBtn.disabled = true; 
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

function validate() {
    const convertBtn = document.getElementById('convert');

    if (selectedOption === 'pfx-crtkey' && validFiles.length > 0) {
        convertBtn.disabled = false; 
    } else if (validFiles.length === 2 && selectedOption === 'crtkey-pfx') {
        convertBtn.disabled = false;
    } else {
        convertBtn.disabled = true; 
    }
}

function deleteFilesInDropArea() {
    validFiles = [];
    pfxForButton = undefined;
    crtForButton = undefined;
    keyForButton = undefined;
    notEmptyArea();
}

function styleCloseBtn(){
    close1.style.display = 'block';
}

function showMessage() {
    close1.setAttribute('title', 'Você pode limpar os arquivos do DropArea ou substitui-los com duplo click/arrastando');
    
}

function hideMessage() {
    close1.removeAttribute('title'); 
}



