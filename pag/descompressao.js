const botaoRespiracao = document.querySelector('#botao-respiracao')
const circuloInterno = document.querySelector('#circulo-interno')
const indicadorRespiracao = document.querySelector('#indicador-respiracao')

let exercicioAtivo = false

botaoRespiracao.addEventListener('click', () => {
    exercicioAtivo = !exercicioAtivo
    if (exercicioAtivo) {
        iniciarRespiracao()
    } else {
        pararRespiracao()
    }
})

function iniciarRespiracao() {
    circuloInterno.classList.add('respirando')
    botaoRespiracao.textContent = 'Parar'
    indicadorRespiracao.textContent = 'Inspire'
}

function pararRespiracao() {
    circuloInterno.classList.remove('respirando')
    botaoRespiracao.textContent = 'Iniciar Exercício'
    indicadorRespiracao.textContent = ''
}

circuloInterno.addEventListener('animationiteration', () => {
        if (!exercicioAtivo) {
            return
        }
        if (indicadorRespiracao.textContent === 'Inspire') {
            indicadorRespiracao.textContent = 'Expire'
        } else {
            indicadorRespiracao.textContent = 'Inspire'
        }

    }
)

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