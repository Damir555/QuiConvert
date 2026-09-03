import { loadPdfDocument } from '../adapters/pdfjsAdapter.js';

export async function getPdfInfo(file) {
    const pdfDocument = await loadPdfDocument(file);

    return {
        pdfDocument,
        pageCount: pdfDocument.numPages
    };
}

export async function getPdfPage(pdfDocument, pageNumber) {
    validatePageNumber(pdfDocument, pageNumber);

    return await pdfDocument.getPage(pageNumber);
}

export async function renderPdfPageThumbnail(
    pdfDocument,
    pageNumber,
    options = {}
) {
    const {
        scale = 0.3
    } = options;

    const page = await getPdfPage(
        pdfDocument,
        pageNumber
    );

    const viewport = page.getViewport({
        scale
    });

    const canvas = document.createElement('canvas');
    canvas.className = 'qc-pdf-thumbnail-canvas';

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);

    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error('Canvas context could not be created.');
    }

    await page.render({
        canvasContext: context,
        viewport
    }).promise;

    return {
        canvas,
        pageNumber,
        width: canvas.width,
        height: canvas.height
    };
}

export async function renderAllPdfPageThumbnails(
    pdfDocument,
    options = {}
) {
    if (!pdfDocument) {
        throw new Error('A PDF document is required.');
    }

    const thumbnails = [];

    for (
        let pageNumber = 1;
        pageNumber <= pdfDocument.numPages;
        pageNumber += 1
    ) {
        const thumbnail = await renderPdfPageThumbnail(
            pdfDocument,
            pageNumber,
            options
        );

        thumbnails.push(thumbnail);
    }

    return thumbnails;
}

function validatePageNumber(pdfDocument, pageNumber) {
    if (!pdfDocument) {
        throw new Error('A PDF document is required.');
    }

    if (
        !Number.isInteger(pageNumber) ||
        pageNumber < 1 ||
        pageNumber > pdfDocument.numPages
    ) {
        throw new Error(
            `Invalid PDF page number: ${pageNumber}`
        );
    }
}