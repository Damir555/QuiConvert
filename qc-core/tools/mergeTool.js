import { getFiles } from '../engine/fileState.js';
import { postPdfTool } from '../engine/apiClient.js';

export async function runMergeTool(config) {
    const files = getFiles();

    if (!files.length) {
        throw new Error('Please select at least one PDF file.');
    }

    const formData = new FormData();

    files.forEach((file) => {
        formData.append(config.uploadFieldName, file);
    });

    return await postPdfTool(config, '/api/pdf/merge', formData);
}