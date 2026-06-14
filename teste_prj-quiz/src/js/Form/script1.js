// script1.js — coleta os dados e salva na sessionStorage

let btn = document.querySelector('.btn-gold')
btn.addEventListener('click', pegarDados)

function pegarDados() {
    // Pega cada campo diretamente pelo id — sem tag <form> no HTML
    let nome   = document.querySelector('#nome').value.trim()
    let email  = document.querySelector('#email').value.trim()
    let estado = document.querySelector('#estado').value
    let sexo   = document.querySelector('#sexo').value

    // Validação básica — impede avançar com campos vazios
    if (!nome || !email || !estado || !sexo) {
        alert('Preencha todos os campos antes de avançar.')
        return
    }

    let pessoa = { nome, email, estado, sexo }

    // Salva na sessionStorage como JSON
    sessionStorage.setItem('pessoa', JSON.stringify(pessoa))

    // Redireciona com caminho relativo — funciona em qualquer ambiente
    location.href = 'confirmarCadastro.html'
}