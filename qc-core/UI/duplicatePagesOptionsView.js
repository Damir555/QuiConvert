import {
    getFiles
} from '../engine/fileState.js';

import {
    createPageSelectionView
} from './pageSelectionView.js';

export function renderDuplicatePagesOptionsView(
    container
) {
    const selectionView =
        createPageSelectionView({
            container,
            title: 'Duplicate PDF pages',
            description:
                'Click the pages you want to duplicate.',
            selectionTitle:
                'Pages selected for duplication',
            loadedStatus: (pageCount) =>
                `${pageCount} pages loaded. ` +
                'Click pages to mark them for duplication.'
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
                '[DuplicatePagesOptionsView] ' +
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
                '[DuplicatePagesOptionsView] Preview failed:',
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