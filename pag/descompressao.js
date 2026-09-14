const botaoRespiracao = document.querySelector('#botao-respiracao')
const circuloInterno = document.querySelector('#circulo-interno')
const indicadorRespiracao = document.querySelector('#indicador-respiracao')
let exercicioAtivo = false
let ciclos = 0

botaoRespiracao.addEventListener('click', () => {
    if (exercicioAtivo) {
        return
    }
    iniciarRespiracao()
})

function iniciarRespiracao() {
    exercicioAtivo = true
    ciclos = 0
    botaoRespiracao.style.display = 'none'
    executarCiclo()
}

function executarCiclo() {
    if (ciclos >= 5) {
        finalizarRespiracao()
        return
    }
    indicadorRespiracao.textContent = 'Inspire'
    circuloInterno.classList.remove('expirando')
    circuloInterno.classList.add('inspirando')
    setTimeout(() => {
        indicadorRespiracao.textContent = 'Expire'
        circuloInterno.classList.remove('inspirando')
        circuloInterno.classList.add('expirando')
        setTimeout(() => {
            ciclos++
            executarCiclo()
        }, 5000)
    }, 5000)
}

function finalizarRespiracao() {
    exercicioAtivo = false
    circuloInterno.classList.remove('inspirando')
    circuloInterno.classList.remove('expirando')
    indicadorRespiracao.textContent = ''
    botaoRespiracao.style.display = 'block'
}

const modal = document.querySelector('#modal-conteudo')

const iframe = document.querySelector('#iframe-conteudo')

const tituloModal = document.querySelector('#titulo-modal')

const fecharModal = document.querySelector('#fechar-modal')

const botoesConteudo = document.querySelectorAll('.botao-conteudo')

botoesConteudo.forEach(botao => {
    botao.addEventListener('click', () => {
        const caminho = botao.dataset.conteudo
        const titulo = botao.dataset.titulo
        tituloModal.textContent = titulo
        iframe.src = caminho
        modal.classList.add('aberto')
        modal.setAttribute('aria-hidden', 'false')
    })
})

function fecharConteudo() {
    modal.classList.remove('aberto')
    modal.setAttribute('aria-hidden', 'true')
    iframe.src = ''
}

fecharModal.addEventListener('click', fecharConteudo)

modal.addEventListener('click', event => {
    if (event.target === modal) {
        fecharConteudo()
    }
})

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('aberto') ) {
        fecharConteudo()
    }
})