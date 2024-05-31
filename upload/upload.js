
const { shell } = require('electron');

let pfxForButton;
let crtForButton;
let keyForButton;

let validFiles = [];

const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');

const span1 = document.getElementById('span1');
const span2 = document.getElementById('span2');

const fonte = document.getElementById('fonte');

const selectedOption = localStorage.getItem('selectedOption');
const dropAreaText = document.getElementById('drop-area-text');

document.addEventListener('DOMContentLoaded', () => {
    const btnOut = document.getElementById('docs');
    btnOut.addEventListener('click', () => {
        shell.openExternal('https://github.com/dev-ana-lopes/Cert-Client');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const selectedOption = localStorage.getItem('selectedOption');
    console.log(selectedOption);
});

function openInputFiles() {
    if (selectedOption === 'pfx-crtkey') {
        console.log('Opção selecionada: PFX para CRT + KEY');
        pfxForButton = document.getElementById('pfxInput').click();
    } else if (selectedOption === 'crtkey-pfx') {
        console.log('Opção selecionada: CRT + KEY para PFX');
        document.getElementById('crtInput').click();
    }  
}


document.getElementById('pfxInput').addEventListener('change', function(event) {
    pfxForButton = event.target.files;
    console.log(pfxForButton);
    updateFileImages(pfxForButton);
});

document.getElementById('crtInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (extension === '.crt') {
        crtForButton = file;
    } else if (extension === '.key') {
        keyForButton = file;
    }
    console.log('Arquivo CRT:', crtForButton);
    console.log('Arquivo KEY:', keyForButton);
    updateFileImages([crtForButton, keyForButton]);
});

function updateFileImages(files) {
    let validFiles;

    if (selectedOption === 'pfx-crtkey') {
        validFiles = files;
    } else {
        validFiles = files.filter(file => file !== undefined);
    }
   
    console.log("Arquvios:", validFiles);

   hiddenItens(validFiles, selectedOption);
}


function hiddenItens(validFiles, selectedOption) {
    if (validFiles.length === 1 && selectedOption === 'pfx-crtkey') {
        img1.style.display = 'block';
        img2.style.display = 'none';
        fonte.style.display = 'none';
        dropAreaText.style.display = 'none';

        span1.innerText = validFiles[0].name;

    } else if (validFiles.length === 1 && selectedOption === 'crtkey-pfx') {
        img1.style.display = 'block';
        img2.style.display = 'none';
        fonte.style.display = 'none';

        span1.innerText = validFiles[0].name;

    } else if (validFiles.length === 2 && selectedOption === 'crtkey-pfx') {
        img1.style.display = 'block';
        img2.style.display = 'block';
        fonte.style.display = 'none';
        uploadButton.style.display = 'none';

        span1.innerText = validFiles[0].name;
        span2.innerText = validFiles[1].name;
    }
}


/*-------------------------------------*/

const dropArea = document.getElementById('dropArea');

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

function handleFiles(files) {

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

        if (!isValidFile(file, selectedOption, validFiles, fileExtension)) {
            continue;
        }

        validFiles.push(file);
        console.log(`Arquivo solto: ${file.name}`);
    }

    console.log("Arquivos válidos:", validFiles);
    hiddenItens(validFiles, selectedOption); 
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
            console.log('Já existe um arquivo .key. Substituindo...',file);
            return false;
        }
    }

    return true;
}

function typeConvert() {
    if (selectedOption === 'pfx-crtkey') {
        return 'Conversão do PFX para CRT + KEY';
    }
    return 'Conversão do CRT + KEY para PFX';
}

function insertText() {
    document.getElementById("output").innerHTML = typeConvert();
}

document.addEventListener("DOMContentLoaded", function() {
            insertText();
        });