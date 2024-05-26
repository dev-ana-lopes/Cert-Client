document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileUploadText = document.getElementById('file-upload-text');

    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        handleFiles(event.target.files);
    });

    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.classList.remove('dragover');
        const files = event.dataTransfer.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            fileUploadText.innerHTML = `<h4>Arquivo "${file.name}" selecionado.</h4>`;
            console.log(file);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const selectedOption = localStorage.getItem('selectedOption');
    
    if (selectedOption) {
        if (selectedOption === 'pfx-crtkey') {
            console.log('Opção selecionada: PFX para CRT + KEY');
        } else if (selectedOption === 'crtkey-pfx') {
            console.log('Opção selecionada: CRT + KEY para PFX');
        }
    }
});
