import { postPdfTool } from '../engine/apiClient.js';

import {
    requireSingleFile,
    createSingleFileFormData,
    requireTextOption
} from './toolHelpers.js';

export async function runWatermarkTool(config, options = {}) {
    const file = requireSingleFile();

    const text = requireTextOption(
        options,
        'text',
        'Please enter watermark text.'
    );

    const formData = createSingleFileFormData(
        config,
        file
    );

    formData.append('text', text);
    formData.append('color', options.color || 'gray');
    formData.append('size', options.size || 'large');
    formData.append('opacity', options.opacity || '0.25');

    return await postPdfTool(
        config,
        '/api/pdf/watermark',
        formData
    );
}