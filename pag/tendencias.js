const calendario = document.querySelector('#dias-calendario')
const mesAtualTitulo = document.querySelector('#mes-atual')
const humoresMensais = document.querySelector('#humores-mensais')
const historico = document.querySelector('#historico')
const botaoAnterior = document.querySelector('#mes-anterior')
const botaoProximo = document.querySelector('#proximo-mes')
let registros = []
let dataVisualizada = new Date()
async function carregarDados() {
    try {
        const resposta = await fetch('../data/mood_logs.json')
        const dadosJson = await resposta.json()
        const dadosLocalStorage = JSON.parse(localStorage.getItem('mindcare_checkins')) || []
        registros = [...dadosJson, ...dadosLocalStorage]
        atualizarPagina()
    } catch (erro) {
        console.error('Erro ao carregar os dados:', erro)
        humoresMensais.innerHTML = `
            <p class="carregando">
                Não foi possível carregar os dados.
            </p>
        `
        historico.innerHTML = `
            <p class="carregando">
                Não foi possível carregar o histórico.
            </p>
        `
    }
}
function criarData(dataString) {
    const partes = dataString.split('-')
    return new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]))
}
function nomeDoMes(data) {
    return data.toLocaleDateString('pt-BR',  {month: 'long', year: 'numeric'})
}
function encontrarRegistro(data) {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')
    const dataFormatada =`${ano}-${mes}-${dia}`
    return registros.find(registro => registro.data === dataFormatada)
}
function atualizarPagina() {
    mesAtualTitulo.textContent = nomeDoMes(dataVisualizada)
    criarCalendario()
    criarAnaliseMensal()
    criarHistoricoSemanal()
}
function criarCalendario() {
    calendario.innerHTML = ''
    const ano = dataVisualizada.getFullYear()
    const mes = dataVisualizada.getMonth()
    const primeiroDia = new Date(ano, mes, 1).getDay()
    const quantidadeDias = new Date(ano, mes + 1, 0).getDate()
    for (let i = 0; i < primeiroDia; i++) {
        const vazio = document.createElement('div')
        vazio.classList.add('dia', 'vazio')
        calendario.appendChild(vazio)
    }
    for (let dia = 1; dia <= quantidadeDias;dia++) {
        const elemento = document.createElement('div')
        elemento.classList.add('dia')
        const data = new Date(ano, mes, dia)
        const registro = encontrarRegistro(data)
        const numero = document.createElement('span')
        numero.classList.add('numero-dia')
        numero.textContent = dia
        elemento.appendChild(numero)
        const hoje = new Date()
        if (data.getDate() === hoje.getDate() && data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear()) {
            elemento.classList.add('hoje')
        }
        if (registro) {
            elemento.classList.add('com-humor')
            const bolinha = document.createElement('span')
            bolinha.classList.add('bolinha-dia', classeHumor(registro.humor))
            elemento.appendChild(bolinha)
            elemento.title = registro.humor
        }
        calendario.appendChild(elemento)
    }
}
function classeHumor(humor) {
    const classes = {
        'Energizado': 'energizado',
        'Calmo': 'calmo',
        'Bem': 'bem',
        'Cansado': 'cansado',
        'Ansioso': 'ansioso',
        'Pressionado': 'pressionado',
        'Triste': 'triste'
    }
    return classes[humor] || ''
}
function criarAnaliseMensal() {
    const ano = dataVisualizada.getFullYear()
    const mes = dataVisualizada.getMonth()
    const registrosDoMes = registros.filter(registro => {
            const data = criarData(registro.data)
            return (data.getFullYear() === ano &&data.getMonth() === mes)
        })
    if (registrosDoMes.length === 0) {
        humoresMensais.innerHTML = `
            <p class="carregando">
                Ainda não existem registros
                para este mês.
            </p>
        `
        return
    }
    const contagem = {}
    registrosDoMes.forEach(registro => {
            contagem[registro.humor] = (contagem[registro.humor] || 0) + 1
        })
    const humores = Object.entries(contagem).sort((a, b) => b[1] - a[1])
    humoresMensais.innerHTML = ''
    humores.forEach(([humor, quantidade]) => {
            const elemento = document.createElement('div')
            elemento.classList.add('humor-mensal')
            const classe = classeHumor(humor)
            elemento.innerHTML = `
                <div class="icone-humor">
                    <img
                        src="../img/${imagemHumor(humor)}"
                        alt="${humor}"
                    >
                </div>

                <div class="informacao-humor">

                    <strong>
                        ${humor}
                    </strong>

                    <span>
                        ${quantidade}
                        ${quantidade === 1
                            ? 'registro'
                            : 'registros'}
                    </span>

                </div>
            `
            humoresMensais.appendChild(elemento)
        })
}
function imagemHumor(humor) {
    const imagens = {
        'Energizado': 'energizado.png',
        'Calmo': 'calmo.png',
        'Bem': 'bem.png',
        'Cansado': 'cansado.png',
        'Ansioso': 'ansioso.png',
        'Pressionado': 'sobrecarregado.png',
        'Triste': 'triste.png'
    }
    return imagens[humor]
}
function criarHistoricoSemanal() {
    historico.innerHTML = ''
    const hoje = new Date()
    const domingo = new Date(hoje)
    domingo.setDate(hoje.getDate() - hoje.getDay())
    for (let i = 0; i < 7; i++) {
        const data = new Date(domingo)
        data.setDate(domingo.getDate() + i)
        criarRegistroDia(data)
    }
}
function criarRegistroDia(data) {
    const elemento = document.createElement('div')
    elemento.classList.add('registro-dia')
    const registro = encontrarRegistro(data)
    const dataFormatada = data.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})
    const diaSemana = data.toLocaleDateString('pt-BR', {weekday: 'long'})
    let conteudo = `
        <div class="data-registro">

            <strong>
                ${dataFormatada}
            </strong>

            <span>
                ${capitalizar(diaSemana)}
            </span>

        </div>
    `
    if (!registro) {
        conteudo += `
            <p class="sem-registro">
                Nenhum check-in registrado.
            </p>
        `
    } else {
        conteudo += `
            <div class="humor-registro">

                <i
                    class="bolinha
                    ${classeHumor(registro.humor)}">
                </i>

                <strong>
                    ${registro.humor}
                </strong>

            </div>


            <div class="influencias">

                <strong>
                    Influências:
                </strong>

                ${registro.influencias &&
                  registro.influencias.length > 0
                    ? registro.influencias.join(', ')
                    : 'Nenhuma informada'
                }

            </div>
        `
    }
    elemento.innerHTML = conteudo
    historico.appendChild(elemento)
}
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1)
}
botaoAnterior.addEventListener(
    'click', () => {
        dataVisualizada.setMonth(dataVisualizada.getMonth() - 1)
        atualizarPagina()
    }
)
botaoProximo.addEventListener(
    'click', () => {
        dataVisualizada.setMonth(dataVisualizada.getMonth() + 1)
        atualizarPagina()
    }
)
carregarDados()