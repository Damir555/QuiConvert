import {
    getFiles
} from '../engine/fileState.js';

import {
    initializeRearrangePreview,
    getRearrangePreviewState,
    destroyRearrangePreview
} from '../tools/rearrangeTool.js';

export function renderRearrangeOptionsView(
    container
) {
    container.innerHTML = '';

    const wrapper =
        document.createElement('div');

    wrapper.className =
        'qc-tool-options qc-rearrange-options';

    const title =
        document.createElement('h3');

    title.textContent =
        'Arrange PDF pages';

    const description =
        document.createElement('p');

    description.textContent =
        'Drag pages into a new order or use the arrow buttons.';

    const status =
        document.createElement('div');

    status.className =
        'qc-rearrange-status';

    status.textContent =
        'Select one PDF file to display its pages.';

    const thumbnailContainer =
        document.createElement('div');

    thumbnailContainer.className =
        'qc-thumbnail-container';

    const orderTitle =
        document.createElement('h4');

    orderTitle.textContent =
        'Current page order';

    const orderOutput =
        document.createElement('div');

    orderOutput.className =
        'qc-page-order-output';

    orderOutput.textContent =
        'No page order available.';

    wrapper.appendChild(title);
    wrapper.appendChild(description);
    wrapper.appendChild(status);
    wrapper.appendChild(thumbnailContainer);
    wrapper.appendChild(orderTitle);
    wrapper.appendChild(orderOutput);

    container.appendChild(wrapper);

    let refreshVersion = 0;
    let destroyed = false;

    async function refreshPreview() {
        const currentVersion =
            ++refreshVersion;

        destroyRearrangePreview();

        thumbnailContainer.innerHTML = '';

        orderOutput.textContent =
            'No page order available.';

        const files = getFiles();

        if (files.length === 0) {
            status.className =
                'qc-rearrange-status';

            status.textContent =
                'Select one PDF file to display its pages.';

            return;
        }

        if (files.length > 1) {
            status.className =
                'qc-rearrange-status qc-error';

            status.textContent =
                'Rearrange accepts exactly one PDF file.';

            return;
        }

        const file = files[0];

        status.className =
            'qc-rearrange-status';

        status.textContent =
            'Loading PDF pages...';

        try {
            const result =
                await initializeRearrangePreview(
                    file,
                    thumbnailContainer,
                    {
                        scale: 0.3,

                        onChange(state) {
                            if (destroyed) {
                                return;
                            }

                            orderOutput.textContent =
                                state.serializedPageOrder ||
                                'No page order available.';
                        }
                    }
                );

            if (
                destroyed ||
                currentVersion !== refreshVersion
            ) {
                return;
            }

            status.textContent =
                `${result.pageCount} pages loaded. ` +
                'Drag pages or use the arrow buttons.';

            orderOutput.textContent =
                result.serializedPageOrder;
        } catch (error) {
            if (
                destroyed ||
                currentVersion !== refreshVersion
            ) {
                return;
            }

            console.error(
                '[RearrangeOptionsView] Preview failed:',
                error
            );

            destroyRearrangePreview();

            thumbnailContainer.innerHTML = '';

            status.className =
                'qc-rearrange-status qc-error';

            status.textContent =
                error.message ||
                'The PDF preview could not be created.';

            orderOutput.textContent =
                'No page order available.';
        }
    }

    function handleFilesChanged() {
        refreshPreview();
    }

    window.addEventListener(
        'qc:files-changed',
        handleFilesChanged
    );

    refreshPreview();

    return {
        getOptions() {
            const state =
                getRearrangePreviewState();

            return {
                pageOrder:
                    state.serializedPageOrder
            };
        },

        destroy() {
            destroyed = true;
            refreshVersion += 1;

            window.removeEventListener(
                'qc:files-changed',
                handleFilesChanged
            );

            destroyRearrangePreview();
            container.innerHTML = '';
        }
    };
}