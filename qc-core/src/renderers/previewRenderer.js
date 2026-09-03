import {
    getPdfInfo
} from "../../renderers/pdfRenderer.js";

import {
    PageViewer
} from "../viewers/pageViewer.js";

export class PreviewRenderer {

    constructor() {
        this.renderToken = 0;

        this.container = null;

        this.pageViewer = null;
        this.pdfDocument = null;

        this.pageCount = 0;
        this.displayedPage = null;

        this.navigationElement = null;
        this.previousButton = null;
        this.nextButton = null;
        this.pageInformation = null;

        this.onDocumentReady = null;
        this.onPreviousPage = null;
        this.onNextPage = null;
        this.onError = null;

        this.handlePreviousPage =
            this.handlePreviousPage.bind(this);

        this.handleNextPage =
            this.handleNextPage.bind(this);
    }

    async render(
        container,
        workspaceDocument,
        options = {}
    ) {
        if (!(container instanceof HTMLElement)) {
            throw new TypeError(
                "PreviewRenderer requires a valid container element."
            );
        }

        if (
            options === null ||
            typeof options !== "object" ||
            Array.isArray(options)
        ) {
            throw new TypeError(
                "PreviewRenderer options must be an object."
            );
        }

        const token =
            ++this.renderToken;

        this.resetPreviewState();

        this.container =
            container;

        this.assignCallbacks(
            options
        );

        container.innerHTML = "";

        if (!workspaceDocument) {
            return;
        }

        if (
            workspaceDocument.type !==
            "application/pdf"
        ) {
            this.renderMessage(
                container,
                "Preview is available only for PDF documents."
            );

            return;
        }

        const file =
            workspaceDocument.file;

        if (!(file instanceof File)) {
            this.renderMessage(
                container,
                "The source PDF file is unavailable."
            );

            return;
        }

        const previewHost =
            document.createElement("div");

        previewHost.dataset.qcRole =
            "pdf-preview";

        container.appendChild(
            previewHost
        );

        this.pageViewer =
            new PageViewer(
                previewHost
            );

        try {
            const {
                pdfDocument,
                pageCount
            } = await getPdfInfo(file);

            if (
                token !== this.renderToken
            ) {
                return;
            }

            this.pdfDocument =
                pdfDocument;

            this.pageCount =
                pageCount;

            this.createNavigation(
                container
            );

            if (this.onDocumentReady) {
                this.onDocumentReady({
                    pageCount:
                        this.pageCount
                });
            }

            const initialPage =
                this.resolveInitialPage(
                    options.pageNumber
                );

            await this.setCurrentPage(
                initialPage
            );
        } catch (error) {
            if (
                token !== this.renderToken
            ) {
                return;
            }

            this.renderError(
                container,
                error
            );

            if (this.onError) {
                this.onError(error);
            }
        }
    }

    assignCallbacks(options) {
        this.onDocumentReady =
            typeof options.onDocumentReady ===
            "function"
                ? options.onDocumentReady
                : null;

        this.onPreviousPage =
            typeof options.onPreviousPage ===
            "function"
                ? options.onPreviousPage
                : null;

        this.onNextPage =
            typeof options.onNextPage ===
            "function"
                ? options.onNextPage
                : null;

        this.onError =
            typeof options.onError ===
            "function"
                ? options.onError
                : null;
    }

    resolveInitialPage(pageNumber) {
        if (
            Number.isInteger(pageNumber) &&
            pageNumber >= 1 &&
            pageNumber <= this.pageCount
        ) {
            return pageNumber;
        }

        return 1;
    }

    createNavigation(container) {
        this.navigationElement =
            document.createElement("div");

        this.navigationElement.dataset.qcRole =
            "preview-navigation";

        this.navigationElement.className =
            "qc-preview-navigation";

        this.previousButton =
            document.createElement("button");

        this.previousButton.type =
            "button";

        this.previousButton.textContent =
            "← Previous";

        this.previousButton.dataset.qcAction =
            "preview-previous-page";

        this.previousButton.addEventListener(
            "click",
            this.handlePreviousPage
        );

        this.pageInformation =
            document.createElement("span");

        this.pageInformation.dataset.qcRole =
            "preview-page-information";

        this.nextButton =
            document.createElement("button");

        this.nextButton.type =
            "button";

        this.nextButton.textContent =
            "Next →";

        this.nextButton.dataset.qcAction =
            "preview-next-page";

        this.nextButton.addEventListener(
            "click",
            this.handleNextPage
        );

        this.navigationElement.append(
            this.previousButton,
            this.pageInformation,
            this.nextButton
        );

        container.appendChild(
            this.navigationElement
        );

        this.updateNavigation();
    }

    handlePreviousPage() {
        if (
            this.displayedPage === null ||
            this.displayedPage <= 1
        ) {
            return;
        }

        const requestedPage =
            this.displayedPage - 1;

        if (this.onPreviousPage) {
            this.onPreviousPage(
                requestedPage
            );
        }
    }

    handleNextPage() {
        if (
            this.displayedPage === null ||
            this.displayedPage >=
                this.pageCount
        ) {
            return;
        }

        const requestedPage =
            this.displayedPage + 1;

        if (this.onNextPage) {
            this.onNextPage(
                requestedPage
            );
        }
    }

    async setCurrentPage(pageNumber) {
        if (
            !Number.isInteger(pageNumber)
        ) {
            return false;
        }

        if (
            pageNumber < 1 ||
            pageNumber > this.pageCount
        ) {
            return false;
        }

        if (
            !this.pageViewer ||
            !this.pdfDocument
        ) {
            return false;
        }

        if (
            pageNumber ===
                this.displayedPage
        ) {
            this.updateNavigation();

            return true;
        }

        const token =
            this.renderToken;

        try {
            await this.pageViewer.showPage(
                this.pdfDocument,
                pageNumber,
                {
                    scale: 1.2
                }
            );

            if (
                token !== this.renderToken
            ) {
                return false;
            }

            this.displayedPage =
                pageNumber;

            this.updateNavigation();

            return true;
        } catch (error) {
            if (
                token !== this.renderToken
            ) {
                return false;
            }

            if (
                this.container
            ) {
                this.renderError(
                    this.container,
                    error
                );
            }

            if (this.onError) {
                this.onError(error);
            }

            return false;
        }
    }

    updateNavigation() {
        if (this.pageInformation) {
            if (
                this.displayedPage === null ||
                this.pageCount <= 0
            ) {
                this.pageInformation.textContent =
                    "Page unavailable";
            } else {
                this.pageInformation.textContent =
                    `Page ${this.displayedPage} of ${this.pageCount}`;
            }
        }

        if (this.previousButton) {
            this.previousButton.disabled =
                this.displayedPage === null ||
                this.displayedPage <= 1;
        }

        if (this.nextButton) {
            this.nextButton.disabled =
                this.displayedPage === null ||
                this.displayedPage >=
                    this.pageCount;
        }
    }

    renderMessage(
        container,
        text
    ) {
        const message =
            document.createElement("p");

        message.textContent =
            text;

        container.appendChild(
            message
        );
    }

    renderError(
        container,
        error
    ) {
        container.innerHTML = "";

        const message =
            document.createElement("p");

        message.dataset.qcRole =
            "preview-error";

        message.textContent =
            "Preview could not be rendered.";

        container.appendChild(
            message
        );

        console.error(
            "Preview rendering failed:",
            error
        );
    }

    resetPreviewState() {
        if (this.previousButton) {
            this.previousButton.removeEventListener(
                "click",
                this.handlePreviousPage
            );
        }

        if (this.nextButton) {
            this.nextButton.removeEventListener(
                "click",
                this.handleNextPage
            );
        }

        if (this.pageViewer) {
            this.pageViewer.destroy();
        }

        this.container = null;

        this.pageViewer = null;
        this.pdfDocument = null;

        this.pageCount = 0;
        this.displayedPage = null;

        this.navigationElement = null;
        this.previousButton = null;
        this.nextButton = null;
        this.pageInformation = null;

        this.onDocumentReady = null;
        this.onPreviousPage = null;
        this.onNextPage = null;
        this.onError = null;
    }

    invalidate() {
        this.renderToken += 1;

        this.resetPreviewState();

        return this;
    }

    destroy() {
        this.invalidate();

        return this;
    }
}