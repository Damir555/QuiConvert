import { renderRadioField } from './radioField.js';
import { renderTextField } from './textField.js';

export const FIELD_RENDERERS = {
    radio: renderRadioField,
    text: renderTextField
};