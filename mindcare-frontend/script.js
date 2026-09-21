const form = document.querySelector('#checkin-form')
const message = document.querySelector('#mensagem')
const detalhes = document.querySelector('#detalhes')
const nomeUsuario = document.querySelector('#username')
fetch('data/users.json')
    .then(response => response.json())
    .then(users => {
        const usuario = users[0];

        nomeUsuario.textContent = usuario.nome;
    })
    .catch(error => {
        console.error('Erro ao carregar usuário:', error);
        nomeUsuario.textContent = 'usuário';
})
const selections = {
    humor: null,
    influencia: []
}

document.querySelectorAll('[data-group]').forEach(button => {
    button.addEventListener('click', () => {
        const group = button.dataset.group
        const value = button.dataset.value
        if (group === 'humor') {
            document
                .querySelectorAll('[data-group="humor"]')
                .forEach(item => {
                    item.classList.remove('selecionado')
                    item.setAttribute('aria-pressed', 'false')
                });
            selections.humor = value
            button.classList.add('selecionado')
            button.setAttribute('aria-pressed', 'true')
        }
        else {
            const isSelected = selections[group].includes(value)
            if (isSelected) {
                selections[group] = selections[group].filter(
                    item => item !== value
                )
            } else {
                selections[group].push(value)
            }
            button.classList.toggle(
                'selecionado',
                !isSelected
            )
            button.setAttribute(
                'aria-pressed',
                String(!isSelected)
            )
        }
        message.textContent = ''
        message.className = 'mensagem'
    })
})

form.addEventListener('submit', event => {
    event.preventDefault()
    if (!selections.humor) {
        message.textContent = 'Escolha como você está se sentindo para registrar o check-in.'
        message.className = 'mensagem erro'
        document
            .querySelector('[data-group="humor"]')
            .focus()
        return
    }

    const agora = new Date()
    const data = agora.toISOString().split('T')[0]

    const checkinsSalvos = JSON.parse(localStorage.getItem('mindcare_checkins')) || []
    const checkinHoje = checkinsSalvos.some(
        checkin => checkin.data === data
    )
    if (checkinHoje) {
        message.textContent = 'Você já registrou um check-in hoje.'
        message.className = 'mensagem erro'
        return
    }

    const checkin = {
        usuarioId: 1,
        humor: selections.humor,
        influencias: [...selections.influencia],
        detalhes: detalhes.value.trim(),
        data: data,
        horario: agora.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }
    checkinsSalvos.push(checkin)
    localStorage.setItem(
        'mindcare_checkins',
        JSON.stringify(checkinsSalvos)
    )

    message.textContent = 'Check-in registrado. Obrigado por se cuidar hoje.'
    message.className = 'mensagem sucesso'

    form.reset()
    selections.humor = null
    selections.influencia = []
    document
        .querySelectorAll('[data-group]')
        .forEach(button => {
            button.classList.remove('selecionado')
            button.setAttribute(
                'aria-pressed',
                'false'
            )
        })
})
