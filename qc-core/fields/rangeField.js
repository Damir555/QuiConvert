export function renderRangeField(field) {
    const container = document.createElement('div');
    container.className = 'qc-option-field qc-range-field';

    const inputId = `qc-${field.id}`;

    if (field.label) {
        const label = document.createElement('label');
        label.htmlFor = inputId;
        label.textContent = field.label;
        container.appendChild(label);
    }

    const input = document.createElement('input');
    input.id = inputId;
    input.type = 'range';
    input.min = String(field.min ?? 0);
    input.max = String(field.max ?? 100);
    input.step = String(field.step ?? 1);
    input.value = String(field.defaultValue ?? field.min ?? 0);

    container.appendChild(input);

    return {
        container,
        input,
        inputName: null
    };
}