import { postPdfTool } from '../engine/apiClient.js';

import {
    requireSingleFile,
    createSingleFileFormData
} from './toolHelpers.js';

export async function runReversePagesTool(config) {
    const file = requireSingleFile();

    const formData = createSingleFileFormData(
        config,
        file
    );

    return await postPdfTool(
        config,
        '/api/pdf/reverse-pages',
        formData
    );
}