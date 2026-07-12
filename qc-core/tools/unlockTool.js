import { getFiles } from '../engine/fileState.js';
import { postPdfTool } from '../engine/apiClient.js';

export async function runUnlockTool(config, options = {}) {
    const files = getFiles();

    if (!files.length) {
        throw new Error('Please select one PDF file.');
    }

    const password = (options.password || '').trim();

    if (!password) {
        throw new Error('Please enter a password.');
    }

    const formData = new FormData();

    formData.append(
        config.uploadFieldName,
        files[0]
    );

    formData.append(
        'password',
        password
    );

    return await postPdfTool(
        config,
        '/api/pdf/unlock',
        formData
    );
}