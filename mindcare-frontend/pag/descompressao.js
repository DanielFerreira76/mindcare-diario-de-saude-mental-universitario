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
let conteudos = []
fetch('../data/resources.json')
.then(resposta => {
    if (!resposta.ok) {
        throw new Error('Não foi possível carregar o arquivo de conteúdos.')
    }
    return resposta.json()
})
.then(dados => {
    conteudos = dados.conteudos
})
.catch(erro => {
    console.error('Erro ao carregar os conteúdos:', erro)
})
botoesConteudo.forEach(botao => {
    botao.addEventListener('click', () => {
        const idConteudo = botao.dataset.conteudoId
        const conteudo = conteudos.find(item => item.id === idConteudo)
        if (!conteudo) {
            console.error('Conteúdo não encontrado:', idConteudo)
            return
        }
        tituloModal.textContent = conteudo.titulo
        iframe.src = conteudo.arquivo
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
    if (
        event.key === 'Escape' &&
        modal.classList.contains('aberto')
    ) {
        fecharConteudo()
    }
})
