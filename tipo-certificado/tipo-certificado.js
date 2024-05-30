const { shell } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const btnOut = document.getElementById('docs');
    btnOut.addEventListener('click', () => {
        shell.openExternal('https://github.com/dev-ana-lopes/Cert-Client');
    });
});

document.getElementById('termo').addEventListener('click', function(event) {
    event.preventDefault(); 
    window.open(this.href, '_blank');
});

document.getElementById('btn-proximo').addEventListener('click', function(event) {
    const selectedValue = document.querySelector('input[name="opcao"]:checked').value;
    localStorage.setItem('selectedOption', selectedValue);
    const link = this.querySelector('a');
    window.location.href = link.href;
});

function validate() {
    const acceptedTerms = document.getElementById('aceito_termos');
    const check1 = document.getElementById('check');
    const check2 = document.getElementById('check2');
    const btnNext = document.getElementById('btn-proximo');

    if ((check1.checked || check2.checked) && acceptedTerms.checked) {
        btnNext.classList.add('enabled');
        btnNext.disabled = false; 
    } else {
        btnNext.classList.remove('enabled');
        btnNext.disabled = true;
    }

}



