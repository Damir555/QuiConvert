export const TOOL_DEFINITIONS = {
    merge: {
        title: 'Merge PDF',
        accepts: 'application/pdf,.pdf',
        multiple: true,
        output: 'pdf'
    },

    split: {
        title: 'Split PDF',
        accepts: 'application/pdf,.pdf',
        multiple: false,
        output: 'pdf-or-zip'
    },

    rotate: {
        title: 'Rotate PDF',
        accepts: 'application/pdf,.pdf',
        multiple: false,
        output: 'pdf'
    },

    compress: {
        title: 'Compress PDF',
        accepts: 'application/pdf,.pdf',
        multiple: false,
        output: 'pdf'
    },

    protect: {
        title: 'Protect PDF',
        accepts: 'application/pdf,.pdf',
        multiple: false,
        output: 'pdf'
    },

    unlock: {
        title: 'Unlock PDF',
        accepts: 'application/pdf,.pdf',
        multiple: false,
        output: 'pdf'
    },

    watermark: {
        title: 'Watermark PDF',
        accepts: 'application/pdf,.pdf',
        multiple: false,
        output: 'pdf'
    },

    rearrange: {
        title: 'Rearrange PDF Pages',
        accepts: 'application/pdf,.pdf',
        multiple: false,
        output: 'pdf'
    },

    'delete-pages': {
        title: 'Delete PDF Pages',
        accepts: 'application/pdf,.pdf',
        multiple: false,
        output: 'pdf'
    },

    'duplicate-pages': {
        title: 'Duplicate PDF Pages',
        accepts: 'application/pdf,.pdf',
        multiple: false,
        output: 'pdf'
    },

    'extract-pages': {
        title: 'Extract PDF Pages',
        accepts: 'application/pdf,.pdf',
        multiple: false,
        output: 'pdf'
    },

    'reverse-pages': {
        title: 'Reverse PDF Pages',
        accepts: 'application/pdf,.pdf',
        multiple: false,
        output: 'pdf'
    },

    'page-numbers': {
        title: 'Add Page Numbers',
        accepts: 'application/pdf,.pdf',
        multiple: false,
        output: 'pdf'
    },

    'image-to-pdf': {
        title: 'Image to PDF',
        accepts: 'image/jpeg,.jpg,.jpeg',
        multiple: false,
        output: 'pdf'
    },

    'pdf-to-images': {
        title: 'PDF to Images',
        accepts: 'application/pdf,.pdf',
        multiple: false,
        output: 'zip'
    }
};

export function getToolDefinition(toolId) {
    const definition =
        TOOL_DEFINITIONS[toolId];

    if (!definition) {
        throw new Error(
            `Unknown tool definition: ${toolId}`
        );
    }

    return definition;
}