import { getFiles } from '../engine/fileState.js';
import { postPdfTool } from '../engine/apiClient.js';

export async function runMergeTool(config, options = {}) {
    const workspaceFiles = Array.isArray(options.files)
        ? options.files.filter(file => file instanceof File)
        : [];

    // Legacy fallback keeps older qc-core entry points working while the
    // Workspace path now uses WorkspaceStore as its source of truth.
    const files = workspaceFiles.length > 0
        ? workspaceFiles
        : getFiles();

    if (!files.length) {
        throw new Error('Please select at least one PDF file.');
    }

    const formData = new FormData();

    files.forEach((file) => {
        formData.append(config.uploadFieldName, file);
    });

    return await postPdfTool(config, '/api/pdf/merge', formData);
}
