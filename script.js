const form = document.querySelector('#checkin-form');
const message = document.querySelector('#mensagem');
const selections = {
    humor: null,
    influencia: []
};

document.querySelectorAll('[data-group]').forEach((button) => {
    button.addEventListener('click', () => {
        const group = button.dataset.group;
        const value = button.dataset.value;
        if (group === 'humor') {
            document.querySelectorAll(`[data-group="${group}"]`).forEach((item) => {
                item.classList.remove('selecionado');
                item.setAttribute('aria-pressed', 'false');
            });
            selections[group] = value;
            button.classList.add('selecionado');
            button.setAttribute('aria-pressed', 'true');
        } else {
            const isSelected = selections[group].includes(value);
            selections[group] = isSelected
                ? selections[group].filter((item) => item !== value)
                : [...selections[group], value];
            button.classList.toggle('selecionado', !isSelected);
            button.setAttribute('aria-pressed', String(!isSelected));
        }
        message.textContent = '';
    });
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!selections.humor) {
        message.textContent = 'Escolha como você está se sentindo para registrar o check-in.';
        message.className = 'mensagem erro';
        document.querySelector('[data-group="humor"]').focus();
        return;
    }
    message.textContent = 'Check-in registrado. Obrigado se cuidar hoje.';
    message.className = 'mensagem sucesso';
});
