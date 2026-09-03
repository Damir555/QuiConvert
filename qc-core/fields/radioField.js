export function renderRadioField(field, context = {}) {
    const {
        tool = 'tool'
    } = context;

    const container = document.createElement('fieldset');
    container.className = 'qc-option-field qc-radio-field';

    const inputName = `qc-${tool}-${field.id}`;

    if (field.label) {
        const legend = document.createElement('legend');
        legend.textContent = field.label;
        container.appendChild(legend);
    }

    field.options.forEach((option) => {
        const label = document.createElement('label');
        label.className = 'qc-radio-option';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = inputName;
        input.value = option.value;
        input.checked = Boolean(option.checked);

        const labelText = document.createTextNode(
            ` ${option.label}`
        );

        label.appendChild(input);
        label.appendChild(labelText);
        container.appendChild(label);
    });

    return {
        container,
        inputName,
        input: null
    };
}