import {
    getPdfInfo,
    renderPdfPageThumbnail
} from "../../renderers/pdfRenderer.js";

import {
    createThumbnailItem,
    getThumbnailItemFromEvent,
    getThumbnailItems,
    getItemPageNumber
} from "./thumbnailDom.js";

import {
    renderThumbnailError,
    renderMessage,
    renderError
} from "./thumbnailMessages.js";

import { ThumbnailDragController } from "./thumbnailDragController.js";
import { ThumbnailState } from "./thumbnailState.js";
import { ThumbnailSelection } from "./thumbnailSelection.js";

export class ThumbnailRenderer {

    constructor() {

        this.renderToken = 0;

        this.container = null;
        this.pdfDocument = null;

        this.state =
            new ThumbnailState();

        this.listElement = null;

        this.thumbnailElements =
            new Map();

        this.rearrangeEnabled =
            false;


        this.onPageClick =
            null;

        this.onDocumentReady =
            null;

        this.onPageMove =
            null;

        this.onError =
            null;

        this.handleThumbnailClick =
            this.handleThumbnailClick.bind(
                this
            );

        this.dragController =
            new ThumbnailDragController(
                this
            );

        this.selection =
            new ThumbnailSelection(
                this
            );

    }

    async render(
        container,
        workspaceDocument,
        options = {}
    ) {

        this.validateContainer(
            container
        );

        this.validateOptions(
            options
        );

        const token =
            ++this.renderToken;

        this.resetRendererState();

        this.container =
            container;

        this.assignOptions(
            options
        );

        container.innerHTML =
            "";

        if (!workspaceDocument) {
            return;
        }

        if (
            workspaceDocument.type !==
            "application/pdf"
        ) {

            renderMessage(
                container,
                "Thumbnails are available only for PDF documents."
            );

            return;

        }

        const file =
            workspaceDocument.file;

        if (!(file instanceof File)) {

            renderMessage(
                container,
                "The source PDF file is unavailable."
            );

            return;

        }

        this.listElement =
            document.createElement(
                "div"
            );

        this.listElement.className =
            "qc-thumbnail-list";

        this.listElement.dataset.qcRole =
            "thumbnail-list";

        this.listElement.addEventListener(
            "click",
            this.handleThumbnailClick
        );

        this.dragController.bind();

        container.appendChild(
            this.listElement
        );

        try {

            const {
                pdfDocument,
                pageCount
            } = await getPdfInfo(
                file
            );

            if (
                token !==
                this.renderToken
            ) {
                return;
            }

            this.pdfDocument =
                pdfDocument;

            this.state.initialize(
                pageCount,
                {
                    pageOrder:
                        options.pageOrder,
                    activePage:
                        options.activePage,
                    selectedPages:
                        options.selectedPages
                }
            );

            if (
                this.onDocumentReady
            ) {

                this.onDocumentReady({

                    pageCount:
                        this.getPageCount(),

                    pageOrder:
                        this.getPageOrder()

                });

            }

            await this.renderThumbnails(
                token
            );

        } catch (error) {

            if (
                token !==
                this.renderToken
            ) {
                return;
            }

            renderError(
                container,
                error
            );

            if (this.onError) {
                this.onError(
                    error
                );
            }

        }

    }

    validateContainer(container) {

        if (
            !(container instanceof HTMLElement)
        ) {

            throw new TypeError(
                "ThumbnailRenderer requires a valid container element."
            );

        }

    }

    validateOptions(options) {

        if (
            options === null ||
            typeof options !== "object" ||
            Array.isArray(options)
        ) {

            throw new TypeError(
                "ThumbnailRenderer options must be an object."
            );

        }

        if (
            options.pageOrder !== undefined &&
            !Array.isArray(
                options.pageOrder
            )
        ) {

            throw new TypeError(
                "ThumbnailRenderer pageOrder must be an array."
            );

        }

        if (
            options.selectedPages !== undefined &&
            !Array.isArray(
                options.selectedPages
            )
        ) {

            throw new TypeError(
                "ThumbnailRenderer selectedPages must be an array."
            );

        }

    }

    assignOptions(options) {

        this.rearrangeEnabled =
            options.rearrangeEnabled ===
            true;

        this.onPageClick =
            typeof options.onPageClick ===
            "function"
                ? options.onPageClick
                : null;

        this.onDocumentReady =
            typeof options.onDocumentReady ===
            "function"
                ? options.onDocumentReady
                : null;

        this.onPageMove =
            typeof options.onPageMove ===
            "function"
                ? options.onPageMove
                : null;

        this.onError =
            typeof options.onError ===
            "function"
                ? options.onError
                : null;

    }

    resolveInitialPage(pageNumber) {

        return this.state
            .resolveInitialPage(
                pageNumber
            );

    }

    resolveInitialPageOrder(
        pageOrder
    ) {

        return this.state
            .resolveInitialPageOrder(
                pageOrder
            );

    }

    resolveInitialSelectedPages(
        selectedPages
    ) {

        return this.state
            .resolveInitialSelectedPages(
                selectedPages
            );

    }

    isValidPageOrder(pageOrder) {

        return this.state
            .isValidPageOrder(
                pageOrder
            );

    }

    isValidPageNumber(
        pageNumber
    ) {

        return this.state
            .isValidPageNumber(
                pageNumber
            );

    }

    async renderThumbnails(token) {

        if (
            !this.pdfDocument ||
            !this.listElement
        ) {
            return;
        }

        for (
            const pageNumber of
            this.getPageOrder()
        ) {

            if (
                token !==
                this.renderToken
            ) {
                return;
            }

            const item =
                createThumbnailItem(
                    pageNumber,
                    {
                        rearrangeEnabled:
                            this.rearrangeEnabled
                    }
                );

            this.listElement.appendChild(
                item
            );

            this.thumbnailElements.set(
                pageNumber,
                item
            );

            try {

                const thumbnail =
                    await renderPdfPageThumbnail(
                        this.pdfDocument,
                        pageNumber,
                        {
                            scale:
                                0.3
                        }
                    );

                if (
                    token !==
                    this.renderToken
                ) {
                    return;
                }

                const canvasHost =
                    item.querySelector(
                        '[data-qc-role="thumbnail-canvas-host"]'
                    );

                if (canvasHost) {

                    canvasHost.innerHTML =
                        "";

                    canvasHost.appendChild(
                        thumbnail.canvas
                    );

                }

            } catch (error) {

                if (
                    token !==
                    this.renderToken
                ) {
                    return;
                }

                renderThumbnailError(
                    item,
                    pageNumber
                );

                console.error(
                    `Thumbnail rendering failed for page ${pageNumber}:`,
                    error
                );

            }

        }

        this.updateActivePageState();
        this.selection.update();
        this.updatePositionState();

    }


    handleThumbnailClick(event) {

        if (!this.listElement) {
            return;
        }

        const item =
            getThumbnailItemFromEvent(
                event,
                this.listElement
            );

        if (!item) {
            return;
        }

        const pageNumber =
            getItemPageNumber(
                item
            );

        if (
            !this.isValidPageNumber(
                pageNumber
            )
        ) {
            return;
        }

        if (this.onPageClick) {

            this.onPageClick(
                pageNumber
            );

        }

    }

    setActivePage(pageNumber) {

        if (
            !this.state.setActivePage(
                pageNumber
            )
        ) {
            return false;
        }

        this.updateActivePageState();

        return true;

    }

    setSelectedPages(selectedPages) {

        return this.selection
            .setSelectedPages(
                selectedPages
            );

    }

    getSelectedPages() {

        return this.selection
            .getSelectedPages();

    }

    setPageOrder(pageOrder) {

        if (
            !this.state.setPageOrder(
                pageOrder
            )
        ) {
            return false;
        }

        this.syncDomWithPageOrder();
        this.updatePositionState();

        return true;

    }

    movePage(
        fromIndex,
        toIndex
    ) {

        const moveResult =
            this.state.movePage(
                fromIndex,
                toIndex
            );

        if (!moveResult) {
            return null;
        }

        this.updatePositionState();

        return moveResult;

    }

    getPageOrder() {

        return this.state
            .getPageOrder();

    }

    updateActivePageState() {

        for (
            const [
                pageNumber,
                item
            ] of this.thumbnailElements
        ) {

            const isActive =
                pageNumber ===
                this.getActivePage();

            item.classList.toggle(
                "is-active",
                isActive
            );

            item.dataset.active =
                isActive
                    ? "true"
                    : "false";

            item.setAttribute(
                "aria-current",
                isActive
                    ? "page"
                    : "false"
            );

        }

    }

    updatePositionState() {

        const items =
            getThumbnailItems(
                this.listElement
            );

        items.forEach(
            (item, index) => {

                item.dataset.pagePosition =
                    String(
                        index + 1
                    );

                const pageNumber =
                    getItemPageNumber(
                        item
                    );

                item.setAttribute(
                    "aria-label",
                    `Open page ${pageNumber}, position ${index + 1} of ${items.length}`
                );

            }
        );

    }

    syncDomWithPageOrder() {

        if (!this.listElement) {
            return;
        }

        for (
            const pageNumber of
            this.getPageOrder()
        ) {

            const item =
                this.thumbnailElements.get(
                    pageNumber
                );

            if (item) {

                this.listElement.appendChild(
                    item
                );

            }

        }

    }

    getPageCount() {

        return this.state
            .getPageCount();

    }

    getActivePage() {

        return this.state
            .getActivePage();

    }

    resetRendererState() {

        if (this.listElement) {

            this.listElement.removeEventListener(
                "click",
                this.handleThumbnailClick
            );

            this.dragController.unbind();

        }

        this.dragController.clearDragState();

        this.container =
            null;

        this.pdfDocument =
            null;

        this.state.reset();

        this.listElement =
            null;

        this.thumbnailElements.clear();

        this.rearrangeEnabled =
            false;

        this.onPageClick =
            null;

        this.onDocumentReady =
            null;

        this.onPageMove =
            null;

        this.onError =
            null;

    }

    invalidate() {

        this.renderToken +=
            1;

        this.resetRendererState();

        return this;

    }

    destroy() {

        this.invalidate();

        return this;

    }

}