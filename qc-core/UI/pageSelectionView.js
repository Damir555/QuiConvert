import {
    getPdfInfo,
    renderAllPdfPageThumbnails
} from '../renderers/pdfRenderer.js';

export function createPageSelectionView(options) {
    const {
        container,
        title,
        description,
        emptyStatus =
            'Select one PDF file to display its pages.',
        loadingStatus =
            'Loading PDF pages...',
        loadedStatus = (pageCount) =>
            `${pageCount} pages loaded. Click pages to select them.`,
        selectionTitle =
            'Selected pages',
        scale = 0.3,
        onChange = null
    } = options;

    validateContainer(container);

    container.innerHTML = '';

    const wrapper =
        document.createElement('div');

    wrapper.className =
        'qc-tool-options qc-page-selection-view';

    const titleElement =
        document.createElement('h3');

    titleElement.textContent = title;

    const descriptionElement =
        document.createElement('p');

    descriptionElement.textContent =
        description;

    const statusElement =
        document.createElement('div');

    statusElement.className =
        'qc-page-selection-status';

    statusElement.textContent =
        emptyStatus;

    const thumbnailContainer =
        document.createElement('div');

    thumbnailContainer.className =
        'qc-thumbnail-container';

    const selectionTitleElement =
        document.createElement('h4');

    selectionTitleElement.textContent =
        selectionTitle;

    const selectionOutput =
        document.createElement('div');

    selectionOutput.className =
        'qc-page-selection-output';

    selectionOutput.textContent =
        'No pages selected.';

    wrapper.appendChild(titleElement);
    wrapper.appendChild(descriptionElement);
    wrapper.appendChild(statusElement);
    wrapper.appendChild(thumbnailContainer);
    wrapper.appendChild(selectionTitleElement);
    wrapper.appendChild(selectionOutput);

    container.appendChild(wrapper);

    const selectedPages = new Set();

    let loadVersion = 0;
    let destroyed = false;

    async function load(file) {
        const currentVersion =
            ++loadVersion;

        selectedPages.clear();
        thumbnailContainer.innerHTML = '';

        updateSelectionOutput();

        if (!file) {
            setStatus(
                emptyStatus,
                false
            );

            return;
        }

        validatePdfFile(file);

        setStatus(
            loadingStatus,
            false
        );

        try {
            const {
                pdfDocument,
                pageCount
            } = await getPdfInfo(file);

            const thumbnails =
                await renderAllPdfPageThumbnails(
                    pdfDocument,
                    {
                        scale
                    }
                );

            if (
                destroyed ||
                currentVersion !== loadVersion
            ) {
                return;
            }

            thumbnails.forEach((thumbnail) => {
                thumbnailContainer.appendChild(
                    createThumbnailCard(
                        thumbnail
                    )
                );
            });

            setStatus(
                resolveLoadedStatus(
                    loadedStatus,
                    pageCount
                ),
                false
            );
        } catch (error) {
            if (
                destroyed ||
                currentVersion !== loadVersion
            ) {
                return;
            }

            console.error(
                '[PageSelectionView] PDF preview failed:',
                error
            );

            thumbnailContainer.innerHTML = '';

            setStatus(
                error.message ||
                    'The PDF preview could not be created.',
                true
            );

            throw error;
        }
    }

    function createThumbnailCard(thumbnail) {
        const pageNumber =
            thumbnail.pageNumber;

        const card =
            document.createElement('button');

        card.type = 'button';

        card.className =
            'qc-thumbnail-card qc-selectable-thumbnail';

        card.dataset.pageNumber =
            String(pageNumber);

        card.setAttribute(
            'aria-pressed',
            'false'
        );

        const label =
            document.createElement('div');

        label.className =
            'qc-thumbnail-label';

        label.textContent =
            `Page ${pageNumber}`;

        card.appendChild(thumbnail.canvas);
        card.appendChild(label);

        card.addEventListener('click', () => {
            togglePage(
                pageNumber,
                card
            );
        });

        return card;
    }

    function togglePage(
        pageNumber,
        card
    ) {
        if (selectedPages.has(pageNumber)) {
            selectedPages.delete(pageNumber);

            card.classList.remove(
                'qc-page-selected'
            );

            card.setAttribute(
                'aria-pressed',
                'false'
            );
        } else {
            selectedPages.add(pageNumber);

            card.classList.add(
                'qc-page-selected'
            );

            card.setAttribute(
                'aria-pressed',
                'true'
            );
        }

        updateSelectionOutput();
        notifyChange();
    }

    function getSelectedPages() {
        return Array.from(selectedPages)
            .sort((first, second) => first - second);
    }

    function getSerializedPages() {
        return getSelectedPages().join(',');
    }

    function clearSelection() {
        selectedPages.clear();

        thumbnailContainer
            .querySelectorAll(
                '.qc-page-selected'
            )
            .forEach((card) => {
                card.classList.remove(
                    'qc-page-selected'
                );

                card.setAttribute(
                    'aria-pressed',
                    'false'
                );
            });

        updateSelectionOutput();
        notifyChange();
    }

    function clear() {
        loadVersion += 1;
        selectedPages.clear();

        thumbnailContainer.innerHTML = '';

        setStatus(
            emptyStatus,
            false
        );

        updateSelectionOutput();
        notifyChange();
    }

    function destroy() {
        destroyed = true;
        loadVersion += 1;

        selectedPages.clear();
        container.innerHTML = '';
    }

    function updateSelectionOutput() {
        const serializedPages =
            getSerializedPages();

        selectionOutput.textContent =
            serializedPages ||
            'No pages selected.';
    }

    function notifyChange() {
        if (typeof onChange !== 'function') {
            return;
        }

        onChange({
            pages: getSelectedPages(),
            serializedPages:
                getSerializedPages()
        });
    }

    function setStatus(
        message,
        isError
    ) {
        statusElement.className =
            isError
                ? 'qc-page-selection-status qc-error'
                : 'qc-page-selection-status';

        statusElement.textContent =
            message;
    }

    return {
        load,
        clear,
        clearSelection,
        destroy,
        getSelectedPages,
        getSerializedPages
    };
}

function resolveLoadedStatus(
    loadedStatus,
    pageCount
) {
    if (typeof loadedStatus === 'function') {
        return loadedStatus(pageCount);
    }

    return String(loadedStatus);
}

function validateContainer(container) {
    if (!(container instanceof HTMLElement)) {
        throw new Error(
            'A page selection container is required.'
        );
    }
}

function validatePdfFile(file) {
    if (!(file instanceof File)) {
        throw new Error(
            'A valid PDF file is required.'
        );
    }

    const isPdf =
        file.type === 'application/pdf' ||
        file.name
            .toLowerCase()
            .endsWith('.pdf');

    if (!isPdf) {
        throw new Error(
            'The selected file must be a PDF.'
        );
    }
}