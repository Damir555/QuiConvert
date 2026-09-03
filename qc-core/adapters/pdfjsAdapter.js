import * as pdfjsLib from '../vendor/pdfjs/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc =
    new URL(
        '../vendor/pdfjs/pdf.worker.mjs',
        import.meta.url
    ).href;

export async function loadPdfDocument(file) {
    if (!(file instanceof File)) {
        throw new Error('A valid PDF file is required.');
    }

    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer)
    });

    return await loadingTask.promise;
}

export async function getPdfPageCount(file) {
    const pdfDocument = await loadPdfDocument(file);

    return pdfDocument.numPages;
}