const listaProfissionais = document.querySelector('#lista-profissionais')
const secaoHorarios = document.querySelector('#secao-horarios')
const dataAgendamento = document.querySelector('#data-agendamento')
const areaHorarios = document.querySelector('#area-horarios')
const resumoProfissional = document.querySelector('#resumo-profissional')
const resumoData = document.querySelector('#resumo-data')
const resumoHorario = document.querySelector('#resumo-horario')
const botaoConfirmar = document.querySelector('#botao-confirmar')
const secaoConfirmacao = document.querySelector('#secao-confirmacao')
const secaoCancelamento = document.querySelector('#secao-cancelamento')
const lembreteUsuario = document.querySelector('#lembrete-usuario')
const lembreteProfissional = document.querySelector('#lembrete-profissional')
const lembreteData = document.querySelector('#lembrete-data')
const lembreteHorario = document.querySelector('#lembrete-horario')
const botaoRemarcar = document.querySelector('#botao-remarcar')
const botaoCancelar = document.querySelector('#botao-cancelar')
const botaoNovoAgendamento = document.querySelector('#botao-novo-agendamento')
let profissionais = []
let usuario = null
let profissionalSelecionado = null
let horarioSelecionado = null
const hoje = new Date()
const ano = hoje.getFullYear()
const mes = String(hoje.getMonth() + 1).padStart(2, '0')
const dia = String(hoje.getDate()).padStart(2, '0')
dataAgendamento.min = `${ano}-${mes}-${dia}`

Promise.all([
    fetch('../data/professionals.json'),
    fetch('../data/users.json')
])

.then(async respostas => {
    if (!respostas[0].ok) {
        throw new Error('Erro ao carregar professionals.json')
    }
    if (!respostas[1].ok) {
        throw new Error('Erro ao carregar users.json')
    }
    const dadosProfissionais = await respostas[0].json()
    const dadosUsuarios = await respostas[1].json()
    return {
        profissionais: dadosProfissionais,
        usuarios: dadosUsuarios
    }
})

.then(dados => {
    profissionais = dados.profissionais.profissionais
    usuario = dados.usuarios[0]
    mostrarProfissionais()
})

.catch(erro => {
    console.error(erro)
    listaProfissionais.innerHTML = `
        <p class="mensagem-carregamento">
            Não foi possível carregar os profissionais.
        </p>
    `
})

function mostrarProfissionais() {
    listaProfissionais.innerHTML = ''
    profissionais.forEach(profissional => {
        const card = document.createElement('article')
        card.classList.add('card-profissional')
        const inicial = profissional.nome.charAt(0).toUpperCase()
        card.innerHTML = `
            <div class="icone-profissional">
                ${inicial}
            </div>
            <h3>${profissional.nome}</h3>
            <p class="funcao-profissional">
                ${profissional.funcao}
            </p>
            <p class="especialidade-profissional">
                ${profissional.especialidade}
            </p>
            <button type="button" class="botao-selecionar">Selecionar</button>
        `
        const botao = card.querySelector('.botao-selecionar')
        botao.addEventListener('click', () => {
            selecionarProfissional(profissional, card)

        })
        listaProfissionais.appendChild(card)
    })
}

function selecionarProfissional(profissional, card) {
    profissionalSelecionado = profissional
    horarioSelecionado = null
    document.querySelectorAll('.card-profissional')
        .forEach(item => {
            item.classList.remove('selecionado')
        })
    document.querySelectorAll('.botao-selecionar')
        .forEach(botao => {
            botao.textContent = 'Selecionar'
        })
    card.classList.add('selecionado')
    card.querySelector('.botao-selecionar').textContent = 'Selecionado'
    resumoProfissional.textContent = profissional.nome
    resumoData.textContent = '—'
    resumoHorario.textContent = '—'
    dataAgendamento.value = ''
    areaHorarios.innerHTML = `
        <p class="mensagem-ajuda">
            Selecione uma data para visualizar os horários disponíveis.
        </p>
    `
    botaoConfirmar.disabled = true
    secaoHorarios.classList.remove('secao-desativada')
    secaoHorarios.scrollIntoView({
        behavior: 'smooth', block: 'start'
    })
}

dataAgendamento.addEventListener('change', () => {
    if (!profissionalSelecionado) {
        return
    }
    horarioSelecionado = null
    resumoData.textContent = formatarData(dataAgendamento.value)
    resumoHorario.textContent = '—'
    botaoConfirmar.disabled = true
    mostrarHorarios()
})

function mostrarHorarios() {
    areaHorarios.innerHTML = ''
    const listaHorarios = document.createElement('div')
    listaHorarios.classList.add('lista-horarios')
    profissionalSelecionado.horarios.forEach(horario => {
        const botao = document.createElement('button')
        botao.type = 'button'
        botao.classList.add('botao-horario')
        botao.textContent = horario
        botao.addEventListener('click', () => {
            selecionarHorario(horario, botao)
        })
        listaHorarios.appendChild(botao)
    })
    areaHorarios.appendChild(listaHorarios)
}

function selecionarHorario(horario, botao) {
    document.querySelectorAll('.botao-horario')
        .forEach(item => {
            item.classList.remove('selecionado')
        })
    botao.classList.add('selecionado')
    horarioSelecionado = horario
    resumoHorario.textContent = horario
    botaoConfirmar.disabled = false
}

botaoConfirmar.addEventListener('click', () => {
    if (profissionalSelecionado === null || dataAgendamento.value === '' || horarioSelecionado === null) {
        return
    }
    mostrarConfirmacao()
})

function mostrarConfirmacao() {
    if (usuario && usuario.nome) {
        lembreteUsuario.textContent = usuario.nome
    } else {
        lembreteUsuario.textContent = 'Estudante'
    }
    lembreteProfissional.textContent = profissionalSelecionado.nome
    lembreteData.textContent = formatarData(dataAgendamento.value)
    lembreteHorario.textContent = horarioSelecionado
    secaoHorarios.hidden = true
    secaoConfirmacao.hidden = false
    secaoCancelamento.hidden = true
    secaoConfirmacao.scrollIntoView({
        behavior: 'smooth', block: 'start'
    })
}

botaoRemarcar.addEventListener('click', () => {
    secaoConfirmacao.hidden = true
    secaoHorarios.hidden = false
    horarioSelecionado = null
    resumoHorario.textContent = '—'
    botaoConfirmar.disabled = true
    secaoHorarios.scrollIntoView({
        behavior: 'smooth', block: 'start'
    })
})

botaoCancelar.addEventListener('click', () => {
    secaoConfirmacao.hidden = true
    secaoHorarios.hidden = true
    secaoCancelamento.hidden = false
    profissionalSelecionado = null
    horarioSelecionado = null
    dataAgendamento.value = ''
    resumoProfissional.textContent = '—'
    resumoData.textContent = '—'
    resumoHorario.textContent = '—'
    document.querySelectorAll('.card-profissional')
        .forEach(card => {
            card.classList.remove('selecionado')
        })
    document.querySelectorAll('.botao-selecionar')
        .forEach(botao => {
            botao.textContent = 'Selecionar'
        })
    secaoCancelamento.scrollIntoView({
        behavior: 'smooth', block: 'start'
    })
})

botaoNovoAgendamento.addEventListener('click', () => {
    secaoCancelamento.hidden = true
    secaoHorarios.hidden = false    
    secaoHorarios.classList.add('secao-desativada')    
    profissionalSelecionado = null
    horarioSelecionado = null    
    dataAgendamento.value = ''    
    resumoProfissional.textContent = '—'
    resumoData.textContent = '—'
    resumoHorario.textContent = '—'    
    areaHorarios.innerHTML = `
        <p class="mensagem-ajuda">
            Selecione um profissional e depois uma data.
        </p>
    `
    botaoConfirmar.disabled = true    
    secaoHorarios.scrollIntoView({
        behavior: 'smooth', block: 'start'
    })
})

function formatarData(data) {
    if (!data) {
        return '—'
    }
    const partes = data.split('-')
    const ano = partes[0]
    const mes = partes[1]
    const dia = partes[2]
    return `${dia}/${mes}/${ano}`
}