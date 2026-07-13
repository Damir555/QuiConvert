import {
    getFiles
} from '../engine/fileState.js';

import {
    createPageSelectionView
} from './pageSelectionView.js';

export function renderExtractPagesOptionsView(
    container
) {
    const selectionView =
        createPageSelectionView({
            container,
            title: 'Extract PDF pages',
            description:
                'Click the pages you want to extract into a new PDF.',
            selectionTitle:
                'Pages selected for extraction',
            loadedStatus: (pageCount) =>
                `${pageCount} pages loaded. ` +
                'Click pages to mark them for extraction.'
        });

    let destroyed = false;

    async function refreshPreview() {
        const files = getFiles();

        if (files.length === 0) {
            selectionView.clear();
            return;
        }

        if (files.length > 1) {
            selectionView.clear();

            console.warn(
                '[ExtractPagesOptionsView] ' +
                'Exactly one PDF file is required.'
            );

            return;
        }

        try {
            await selectionView.load(
                files[0]
            );
        } catch (error) {
            console.error(
                '[ExtractPagesOptionsView] Preview failed:',
                error
            );
        }
    }

    function handleFilesChanged() {
        if (!destroyed) {
            refreshPreview();
        }
    }

    window.addEventListener(
        'qc:files-changed',
        handleFilesChanged
    );

    refreshPreview();

    return {
        getOptions() {
            return {
                pages:
                    selectionView.getSerializedPages()
            };
        },

        destroy() {
            destroyed = true;

            window.removeEventListener(
                'qc:files-changed',
                handleFilesChanged
            );

            selectionView.destroy();
        }
    };
}