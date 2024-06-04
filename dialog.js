const { ipcRenderer } = require('electron');

ipcRenderer.on('set-message', (event, { message, type }) => {
    document.getElementById('message').innerText = message;
   
    const header = document.querySelector('header');
    const leftImg = document.getElementById('left-img');
    const title = document.getElementById('title');

console.log(leftImg);

    if (type === 0) {
        header.classList.add('error-header');
        title.innerText = '';
        title.innerText = 'Erro';
        iconError.style.display = 'block';
        check.style.display = 'none';
    }
});
