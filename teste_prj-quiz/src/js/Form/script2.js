const pessoa = JSON.parse(sessionStorage.pessoa)

document.querySelector('[name="nome"]').value = pessoa.nome
document.querySelector('[name="email"]').value = pessoa.email
document.querySelector('[name="estado"]').value = pessoa.estado
document.querySelector('[name="sexo"]').value = pessoa.sexo

document.querySelectorAll('input, select').forEach(campo => {
    campo.addEventListener('input', () => {
        pessoa[campo.name] = campo.value
        sessionStorage.pessoa = JSON.stringify(pessoa)
        atualizarJSON()
    })
})

function atualizarJSON() {
    document.querySelector('.json-preview').textContent =
        JSON.stringify(JSON.parse(sessionStorage.pessoa), null, 2)
}

atualizarJSON()

// Confirmar — só redireciona quando clicar no botão
document.querySelector('#btn-confirmar').addEventListener('click', () => {
    sessionStorage.setItem('cadastroConfirmado', 'true')
    window.location.href = 'index.html'
})

// Voltar
document.querySelector('#btn-voltar').addEventListener('click', () => {
    window.location.href = 'formInicio.html'
})