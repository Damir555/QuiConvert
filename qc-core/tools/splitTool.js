import { getFiles } from '../engine/fileState.js';
import { postPdfTool } from '../engine/apiClient.js';

export async function runSplitTool(config, options = {}) {
    const files = getFiles();

    if (!files.length) {
        throw new Error('Please select one PDF file.');
    }

    const formData = new FormData();

    formData.append(config.uploadFieldName, files[0]);
    formData.append('split_pages', options.splitPages || '');

    return await postPdfTool(config, '/api/pdf/split', formData);
}