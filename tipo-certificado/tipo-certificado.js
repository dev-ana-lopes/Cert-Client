const { shell } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const btnOut = document.getElementById('docs');
    btnOut.addEventListener('click', () => {
        shell.openExternal('https://github.com/dev-ana-lopes/Cert-Client');
    });
});

   