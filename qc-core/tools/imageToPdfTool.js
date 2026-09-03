import { postPdfTool } from '../engine/apiClient.js';

import {
    requireSingleFile,
    createSingleFileFormData
} from './toolHelpers.js';

export async function runImageToPdfTool(config) {
    const file = requireSingleFile();

    validateImage(file);

    const formData = createSingleFileFormData(
        config,
        file
    );

    return await postPdfTool(
        config,
        '/api/pdf/image-to-pdf',
        formData
    );
}

function validateImage(file) {
    const fileName =
        file.name.toLowerCase();

    const isJpeg =
        file.type === 'image/jpeg' ||
        fileName.endsWith('.jpg') ||
        fileName.endsWith('.jpeg');

    if (!isJpeg) {
        throw new Error(
            'Please select a JPG or JPEG image.'
        );
    }
}