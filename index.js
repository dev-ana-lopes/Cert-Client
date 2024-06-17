const btnProximo = document.getElementById('bg-btn-white');
const btnDocumentacao = document.getElementById('bg-btn-out');

document.addEventListener('DOMContentLoaded', function(event) {
    document.getElementById('bg-btn-out').addEventListener('click', function(event) {
        event.preventDefault(); 
        window.open('https://github.com/dev-ana-lopes/Cert-Client', '_blank');
    });
});

function showMessage() {
    btnProximo.setAttribute('title', 'Ao clicar aqui, você será encaminhado(a) para área de conversão do certificado.');
    btnDocumentacao.setAttribute('title', 'Ao clicar aqui, você será encaminhado(a) para documentação no github.');
}