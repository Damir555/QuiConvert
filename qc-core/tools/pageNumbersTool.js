import { postPdfTool } from '../engine/apiClient.js';

import {
    requireSingleFile,
    createSingleFileFormData
} from './toolHelpers.js';

export async function runPageNumbersTool(config) {
    const file = requireSingleFile();

    const formData = createSingleFileFormData(
        config,
        file
    );

    return await postPdfTool(
        config,
        '/api/pdf/page-numbers',
        formData
    );
}