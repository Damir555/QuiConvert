export function renderTextField(field) {
    const container = document.createElement('div');
    container.className = 'qc-option-field qc-text-field';

    const inputId = `qc-${field.id}`;

    const label = document.createElement('label');
    label.htmlFor = inputId;
    label.textContent = field.label || field.id;

    const input = document.createElement('input');
    input.id = inputId;
    input.className = `qc-${field.id}-input`;
    input.type = 'text';
    input.placeholder = field.placeholder || '';

    container.appendChild(label);
    container.appendChild(input);

    return {
        container,
        input,
        inputName: null
    };
}