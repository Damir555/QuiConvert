import { postPdfTool } from '../engine/apiClient.js';

import {
    requireSingleFile,
    createSingleFileFormData
} from './toolHelpers.js';

import {
    getPdfInfo,
    renderAllPdfPageThumbnails
} from '../renderers/pdfRenderer.js';

import {
    initializePageOrder,
    setPageOrder,
    getPageOrder,
    movePage,
    resetPageOrder,
    serializePageOrder
} from '../engine/pageOrderState.js';

let activePreview = null;

export async function initializeRearrangePreview(
    file,
    thumbnailContainer,
    options = {}
) {
    validatePdfFile(file);
    validateContainer(thumbnailContainer);

    destroyRearrangePreview();
    resetPageOrder();

    thumbnailContainer.innerHTML = '';

    const {
        scale = 0.3,
        onChange = null
    } = options;

    const {
        pdfDocument,
        pageCount
    } = await getPdfInfo(file);

    initializePageOrder(pageCount);

    const thumbnails =
        await renderAllPdfPageThumbnails(
            pdfDocument,
            { scale }
        );

    const preview = createPreviewController({
        file,
        pdfDocument,
        thumbnailContainer,
        onChange
    });

    thumbnails.forEach((thumbnail) => {
        const pageCard = createThumbnailCard(
            thumbnail,
            preview
        );

        thumbnailContainer.appendChild(pageCard);
    });

    activePreview = preview;
    notifyPreviewChange(preview);

    return {
        pageCount,
        pdfDocument,
        pageOrder: getPageOrder(),
        serializedPageOrder: serializePageOrder()
    };
}

export async function runRearrangeTool(
    config,
    options = {}
) {
    const file = requireSingleFile();

    const pageOrder = resolvePageOrder(
        options.pageOrder
    );

    if (!pageOrder) {
        throw new Error(
            'Please arrange the PDF pages before processing.'
        );
    }

    const formData = createSingleFileFormData(
        config,
        file
    );

    formData.append(
        'page_order',
        pageOrder
    );

    return await postPdfTool(
        config,
        '/api/pdf/rearrange',
        formData
    );
}

export function getRearrangePreviewState() {
    return {
        pageOrder: getPageOrder(),
        serializedPageOrder: serializePageOrder(),
        isInitialized: Boolean(activePreview)
    };
}

export function destroyRearrangePreview() {
    if (activePreview) {
        activePreview.destroy();
        activePreview = null;
    }

    resetPageOrder();
}

function createPreviewController({
    file,
    pdfDocument,
    thumbnailContainer,
    onChange
}) {
    let draggedCard = null;

    const controller = {
        file,
        pdfDocument,
        thumbnailContainer,
        onChange,

        getDraggedCard() {
            return draggedCard;
        },

        setDraggedCard(card) {
            draggedCard = card;
        },

        syncFromDom() {
            const cards = getThumbnailCards(
                thumbnailContainer
            );

            const nextOrder = cards.map(
                (card) => Number(
                    card.dataset.pageNumber
                )
            );

            setPageOrder(nextOrder);
            notifyPreviewChange(controller);
        },

        destroy() {
            draggedCard = null;
            thumbnailContainer.innerHTML = '';
        }
    };

    return controller;
}

function createThumbnailCard(
    thumbnail,
    preview
) {
    const pageCard =
        document.createElement('div');

    pageCard.className =
        'qc-thumbnail-card';

    pageCard.draggable = true;

    pageCard.dataset.pageNumber = String(
        thumbnail.pageNumber
    );

    const pageLabel =
        document.createElement('div');

    pageLabel.className =
        'qc-thumbnail-label';

    pageLabel.textContent =
        `Page ${thumbnail.pageNumber}`;

    const controls =
        document.createElement('div');

    controls.className =
        'qc-thumbnail-controls';

    const moveLeftButton =
        createMoveButton({
            label: '←',
            title: 'Move page left',
            direction: -1,
            pageCard,
            preview
        });

    const moveRightButton =
        createMoveButton({
            label: '→',
            title: 'Move page right',
            direction: 1,
            pageCard,
            preview
        });

    controls.appendChild(moveLeftButton);
    controls.appendChild(moveRightButton);

    pageCard.appendChild(thumbnail.canvas);
    pageCard.appendChild(pageLabel);
    pageCard.appendChild(controls);

    pageCard.addEventListener(
        'dragstart',
        (event) => handleDragStart(
            event,
            preview
        )
    );

    pageCard.addEventListener(
        'dragover',
        (event) => handleDragOver(
            event,
            preview
        )
    );

    pageCard.addEventListener(
        'drop',
        (event) => handleDrop(
            event,
            preview
        )
    );

    pageCard.addEventListener(
        'dragend',
        () => handleDragEnd(preview)
    );

    return pageCard;
}

function createMoveButton({
    label,
    title,
    direction,
    pageCard,
    preview
}) {
    const button =
        document.createElement('button');

    button.type = 'button';
    button.textContent = label;
    button.title = title;

    button.addEventListener('click', () => {
        moveCard(
            pageCard,
            direction,
            preview
        );
    });

    return button;
}

function moveCard(
    pageCard,
    direction,
    preview
) {
    const {
        thumbnailContainer
    } = preview;

    const cards = getThumbnailCards(
        thumbnailContainer
    );

    const fromIndex =
        cards.indexOf(pageCard);

    const toIndex =
        fromIndex + direction;

    if (
        fromIndex < 0 ||
        toIndex < 0 ||
        toIndex >= cards.length
    ) {
        return;
    }

    movePage(fromIndex, toIndex);

    if (direction < 0) {
        thumbnailContainer.insertBefore(
            pageCard,
            cards[toIndex]
        );
    } else {
        thumbnailContainer.insertBefore(
            cards[toIndex],
            pageCard
        );
    }

    notifyPreviewChange(preview);
}

function handleDragStart(
    event,
    preview
) {
    const draggedCard =
        event.currentTarget;

    preview.setDraggedCard(draggedCard);

    draggedCard.classList.add(
        'qc-dragging'
    );

    if (!event.dataTransfer) {
        return;
    }

    event.dataTransfer.effectAllowed =
        'move';

    event.dataTransfer.setData(
        'text/plain',
        draggedCard.dataset.pageNumber || ''
    );
}

function handleDragOver(
    event,
    preview
) {
    event.preventDefault();

    if (event.dataTransfer) {
        event.dataTransfer.dropEffect =
            'move';
    }

    const draggedCard =
        preview.getDraggedCard();

    const targetCard =
        event.currentTarget;

    if (
        !draggedCard ||
        targetCard === draggedCard
    ) {
        return;
    }

    const targetRect =
        targetCard.getBoundingClientRect();

    const insertAfter =
        event.clientX >
        targetRect.left +
        targetRect.width / 2;

    if (insertAfter) {
        targetCard.after(draggedCard);
    } else {
        targetCard.before(draggedCard);
    }
}

function handleDrop(
    event,
    preview
) {
    event.preventDefault();
    preview.syncFromDom();
}

function handleDragEnd(preview) {
    const draggedCard =
        preview.getDraggedCard();

    if (draggedCard) {
        draggedCard.classList.remove(
            'qc-dragging'
        );
    }

    preview.setDraggedCard(null);
    preview.syncFromDom();
}

function notifyPreviewChange(preview) {
    if (
        typeof preview.onChange !==
        'function'
    ) {
        return;
    }

    preview.onChange({
        pageOrder: getPageOrder(),
        serializedPageOrder:
            serializePageOrder()
    });
}

function getThumbnailCards(container) {
    return Array.from(
        container.querySelectorAll(
            '.qc-thumbnail-card'
        )
    );
}

function resolvePageOrder(value) {
    if (Array.isArray(value)) {
        setPageOrder(value);
        return serializePageOrder();
    }

    if (
        typeof value === 'string' &&
        value.trim()
    ) {
        const normalizedOrder = value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

        setPageOrder(normalizedOrder);

        return serializePageOrder();
    }

    return serializePageOrder();
}

function validatePdfFile(file) {
    if (!(file instanceof File)) {
        throw new Error(
            'A PDF file is required.'
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

function validateContainer(container) {
    if (!(container instanceof HTMLElement)) {
        throw new Error(
            'A thumbnail container is required.'
        );
    }
}