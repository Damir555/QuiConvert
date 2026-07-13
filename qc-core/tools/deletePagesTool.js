import { postPdfTool } from '../engine/apiClient.js';

import {
    requireSingleFile,
    createSingleFileFormData
} from './toolHelpers.js';

export async function runDeletePagesTool(
    config,
    options = {}
) {
    const file = requireSingleFile();

    const pages = normalizePages(
        options.pages
    );

    if (!pages) {
        throw new Error(
            'Select at least one page to delete.'
        );
    }

    const formData = createSingleFileFormData(
        config,
        file
    );

    formData.append(
        'pages',
        pages
    );

    return await postPdfTool(
        config,
        '/api/pdf/delete-pages',
        formData
    );
}

function normalizePages(value) {
    if (Array.isArray(value)) {
        return value
            .map(Number)
            .filter(Number.isInteger)
            .filter((page) => page > 0)
            .join(',');
    }

    if (typeof value !== 'string') {
        return '';
    }

    return value
        .split(',')
        .map((item) => Number(item.trim()))
        .filter(Number.isInteger)
        .filter((page) => page > 0)
        .join(',');
}