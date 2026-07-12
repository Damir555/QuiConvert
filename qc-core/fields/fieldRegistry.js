import { renderRadioField } from './radioField.js';
import { renderTextField } from './textField.js';
import { renderRangeField } from './rangeField.js';

export const FIELD_RENDERERS = {
    radio: renderRadioField,
    text: renderTextField,
    range: renderRangeField
};