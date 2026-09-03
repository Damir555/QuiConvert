import { postPdfTool } from '../engine/apiClient.js';

import {
    requireSingleFile,
    createSingleFileFormData
} from './toolHelpers.js';

export async function runRotateTool(config, options = {}) {
    const file = requireSingleFile();

    const formData = createSingleFileFormData(
        config,
        file
    );

    formData.append(
        'rotation',
        options.rotation || '90'
    );

    return await postPdfTool(
        config,
        '/api/pdf/rotate',
        formData
    );
}