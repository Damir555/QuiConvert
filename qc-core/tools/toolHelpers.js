import { getFiles } from '../engine/fileState.js';

export function requireSingleFile() {
    const files = getFiles();

    if (!files.length) {
        throw new Error('Please select one PDF file.');
    }

    return files[0];
}

export function createSingleFileFormData(config, file) {
    const formData = new FormData();

    formData.append(
        config.uploadFieldName,
        file
    );

    return formData;
}

export function requireTextOption(
    options,
    optionName,
    errorMessage
) {
    const value = String(
        options?.[optionName] ?? ''
    ).trim();

    if (!value) {
        throw new Error(errorMessage);
    }

    return value;
}