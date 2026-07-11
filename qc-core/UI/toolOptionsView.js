import { TOOL_SCHEMAS } from '../schema/toolSchemas.js';
import { FIELD_RENDERERS } from '../fields/fieldRegistry.js';

export function renderToolOptions(container, tool) {
    console.log('[ToolOptions] Render:', tool);

    container.innerHTML = '';

    const schema = TOOL_SCHEMAS[tool];

    if (!schema || !Array.isArray(schema.fields)) {
        return createEmptyOptionsView();
    }

    if (schema.fields.length === 0) {
        return createEmptyOptionsView();
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'qc-tool-options';

    const title = document.createElement('h3');
    title.textContent = schema.title;
    wrapper.appendChild(title);

    const fieldElements = new Map();

    schema.fields.forEach((field) => {
        const renderer = FIELD_RENDERERS[field.type];

        if (!renderer) {
            console.warn(
                '[ToolOptions] Unsupported field type:',
                field.type
            );

            return;
        }

        const fieldElement = renderer(field, {
            tool
        });

        if (!fieldElement?.container) {
            console.warn(
                '[ToolOptions] Invalid renderer result:',
                field.type
            );

            return;
        }

        wrapper.appendChild(fieldElement.container);

        fieldElements.set(field.id, {
            field,
            ...fieldElement
        });
    });

    container.appendChild(wrapper);

    function getFieldValue(fieldId) {
        const fieldEntry = fieldElements.get(fieldId);

        if (!fieldEntry) {
            return undefined;
        }

        if (fieldEntry.field.type === 'radio') {
            return fieldEntry.container.querySelector(
                `input[name="${fieldEntry.inputName}"]:checked`
            )?.value;
        }

        return fieldEntry.input?.value.trim() ?? '';
    }

    function updateDependencies() {
        fieldElements.forEach((fieldEntry) => {
            const condition = fieldEntry.field.enabledWhen;

            if (!condition || !fieldEntry.input) {
                return;
            }

            const controllingValue = getFieldValue(
                condition.field
            );

            const shouldEnable =
                controllingValue === condition.equals;

            fieldEntry.input.disabled = !shouldEnable;

            if (!shouldEnable) {
                fieldEntry.input.value = '';
            }
        });
    }

    fieldElements.forEach((fieldEntry) => {
        if (fieldEntry.field.type !== 'radio') {
            return;
        }

        const radioInputs =
            fieldEntry.container.querySelectorAll(
                `input[name="${fieldEntry.inputName}"]`
            );

        radioInputs.forEach((input) => {
            input.addEventListener(
                'change',
                updateDependencies
            );
        });
    });

    updateDependencies();

    return {
        getOptions() {
            const options = {};

            fieldElements.forEach((fieldEntry, fieldId) => {
                options[fieldId] = getFieldValue(fieldId);
            });

            return options;
        }
    };
}

function createEmptyOptionsView() {
    return {
        getOptions() {
            return {};
        }
    };
}