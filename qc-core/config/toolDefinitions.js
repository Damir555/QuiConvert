export const TOOL_DEFINITIONS = {
    merge: {
        title: "Merge PDF",
        accepts: "application/pdf,.pdf",
        multiple: true,
        output: "pdf",
        capabilities: {
            preview: false,
            thumbnails: false,
            multiFile: true,
            pageReorder: false,
            pageSelection: false,
            toolOptions: false,
            processing: true
        }
    },

    split: {
        title: "Split PDF",
        accepts: "application/pdf,.pdf",
        multiple: false,
        output: "pdf-or-zip",
        capabilities: {
            preview: true,
            thumbnails: true,
            multiFile: false,
            pageReorder: false,
            pageSelection: true,
            toolOptions: true,
            processing: true
        }
    },

    rotate: {
        title: "Rotate PDF",
        accepts: "application/pdf,.pdf",
        multiple: false,
        output: "pdf",
        capabilities: {
            preview: true,
            thumbnails: true,
            multiFile: false,
            pageReorder: false,
            pageSelection: false,
            toolOptions: true,
            processing: true
        }
    },

    compress: {
        title: "Compress PDF",
        accepts: "application/pdf,.pdf",
        multiple: false,
        output: "pdf",
        capabilities: {
            preview: true,
            thumbnails: false,
            multiFile: false,
            pageReorder: false,
            pageSelection: false,
            toolOptions: true,
            processing: true
        }
    },

    protect: {
        title: "Protect PDF",
        accepts: "application/pdf,.pdf",
        multiple: false,
        output: "pdf",
        capabilities: {
            preview: true,
            thumbnails: false,
            multiFile: false,
            pageReorder: false,
            pageSelection: false,
            toolOptions: true,
            processing: true
        }
    },

    unlock: {
        title: "Unlock PDF",
        accepts: "application/pdf,.pdf",
        multiple: false,
        output: "pdf",
        capabilities: {
            preview: true,
            thumbnails: false,
            multiFile: false,
            pageReorder: false,
            pageSelection: false,
            toolOptions: true,
            processing: true
        }
    },

    watermark: {
        title: "Watermark PDF",
        accepts: "application/pdf,.pdf",
        multiple: false,
        output: "pdf",
        capabilities: {
            preview: true,
            thumbnails: true,
            multiFile: false,
            pageReorder: false,
            pageSelection: false,
            toolOptions: true,
            processing: true
        }
    },

    rearrange: {
        title: "Rearrange PDF Pages",
        accepts: "application/pdf,.pdf",
        multiple: false,
        output: "pdf",
        capabilities: {
            preview: true,
            thumbnails: true,
            multiFile: false,
            pageReorder: true,
            pageSelection: false,
            toolOptions: true,
            processing: true
        }
    },

    "delete-pages": {
        title: "Delete PDF Pages",
        accepts: "application/pdf,.pdf",
        multiple: false,
        output: "pdf",
        capabilities: {
            preview: true,
            thumbnails: true,
            multiFile: false,
            pageReorder: false,
            pageSelection: true,
            toolOptions: true,
            processing: true
        }
    },

    "duplicate-pages": {
        title: "Duplicate PDF Pages",
        accepts: "application/pdf,.pdf",
        multiple: false,
        output: "pdf",
        capabilities: {
            preview: true,
            thumbnails: true,
            multiFile: false,
            pageReorder: false,
            pageSelection: true,
            toolOptions: true,
            processing: true
        }
    },

    "extract-pages": {
        title: "Extract PDF Pages",
        accepts: "application/pdf,.pdf",
        multiple: false,
        output: "pdf",
        capabilities: {
            preview: true,
            thumbnails: true,
            multiFile: false,
            pageReorder: false,
            pageSelection: true,
            toolOptions: true,
            processing: true
        }
    },

    "reverse-pages": {
        title: "Reverse PDF Pages",
        accepts: "application/pdf,.pdf",
        multiple: false,
        output: "pdf",
        capabilities: {
            preview: true,
            thumbnails: true,
            multiFile: false,
            pageReorder: false,
            pageSelection: false,
            toolOptions: false,
            processing: true
        }
    },

    "page-numbers": {
        title: "Add Page Numbers",
        accepts: "application/pdf,.pdf",
        multiple: false,
        output: "pdf",
        capabilities: {
            preview: true,
            thumbnails: true,
            multiFile: false,
            pageReorder: false,
            pageSelection: false,
            toolOptions: true,
            processing: true
        }
    },

    "image-to-pdf": {
        title: "Image to PDF",
        accepts: "image/jpeg,.jpg,.jpeg",
        multiple: false,
        output: "pdf",
        capabilities: {
            preview: false,
            thumbnails: false,
            multiFile: false,
            pageReorder: false,
            pageSelection: false,
            toolOptions: true,
            processing: true
        }
    },

    "pdf-to-images": {
        title: "PDF to Images",
        accepts: "application/pdf,.pdf",
        multiple: false,
        output: "zip",
        capabilities: {
            preview: true,
            thumbnails: false,
            multiFile: false,
            pageReorder: false,
            pageSelection: false,
            toolOptions: false,
            processing: true
        }
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
