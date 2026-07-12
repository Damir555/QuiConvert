import { postPdfTool } from '../engine/apiClient.js';

import {
    requireSingleFile,
    createSingleFileFormData
} from './toolHelpers.js';

export async function runSplitTool(config, options = {}) {
    const file = requireSingleFile();

    const formData = createSingleFileFormData(
        config,
        file
    );

    formData.append(
        'split_pages',
        options.splitPages || ''
    );

    return await postPdfTool(
        config,
        '/api/pdf/split',
        formData
    );
}