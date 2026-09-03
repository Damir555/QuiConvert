import { postPdfTool } from '../engine/apiClient.js';

import {
    requireSingleFile,
    createSingleFileFormData,
    requireTextOption
} from './toolHelpers.js';

export async function runProtectTool(config, options = {}) {
    const file = requireSingleFile();

    const password = requireTextOption(
        options,
        'password',
        'Please enter a password.'
    );

    const formData = createSingleFileFormData(
        config,
        file
    );

    formData.append(
        'password',
        password
    );

    return await postPdfTool(
        config,
        '/api/pdf/protect',
        formData
    );
}