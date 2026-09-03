import {
    WorkspaceEvents
} from "../workspace/workspaceEvents.js";

import {
    WorkspaceZone
} from "./workspaceZone.js";

import {
    ThumbnailRenderer
} from "../thumbnail/thumbnailRenderer.js";

export class ThumbnailZone extends WorkspaceZone {

    constructor(workspace) {

        super(
            workspace,
            "thumbnail"
        );

        this.thumbnailRenderer =
            new ThumbnailRenderer();

        this.thumbnailContainer =
            null;

        this.renderRequestId =
            0;

        this.handleStoreChanged =
            this.handleStoreChanged.bind(
                this
            );

        this.handleDocumentSessionChanged =
            this.handleDocumentSessionChanged.bind(
                this
            );

        this.handleActivePageChanged =
            this.handleActivePageChanged.bind(
                this
            );

    }

    initialize() {

        if (this.initialized) {
            return this;
        }

        super.initialize();

        this.workspace.on(
            WorkspaceEvents.STORE_CHANGED,
            this.handleStoreChanged
        );

        this.workspace.on(
            WorkspaceEvents.DOCUMENT_SESSION_CHANGED,
            this.handleDocumentSessionChanged
        );

        this.workspace.on(
            WorkspaceEvents.ACTIVE_PAGE_CHANGED,
            this.handleActivePageChanged
        );

        this.render();

        return this;

    }

    handleStoreChanged() {

        if (this.destroyed) {
            return;
        }

        this.render();

    }

    handleDocumentSessionChanged(event) {

        if (
            this.destroyed ||
            !event ||
            typeof event !== "object"
        ) {
            return;
        }

        const activeDocument =
            this.getActiveDocument();

        if (
            !activeDocument ||
            event.documentId !==
                activeDocument.id
        ) {
            return;
        }

        const session =
            this.getActiveDocumentSession();

        if (
            !session ||
            session.isDestroyed()
        ) {
            return;
        }

        const pageCount =
            session.getPageCount();

        const rendererPageCount =
            this.thumbnailRenderer
                .getPageCount();

        if (
            Number.isInteger(pageCount) &&
            pageCount > 0 &&
            rendererPageCount !== pageCount
        ) {

            this.render();

            return;

        }

        const change =
            event.change &&
            typeof event.change === "object"
                ? event.change
                : null;

        if (
            change &&
            change.type === "page-order"
        ) {

            this.thumbnailRenderer
                .setPageOrder(
                    session.getPageOrder()
                );

        }

    }

    handleActivePageChanged(event) {

        if (
            this.destroyed ||
            !event ||
            typeof event !== "object"
        ) {
            return;
        }

        const activeDocument =
            this.getActiveDocument();

        if (
            !activeDocument ||
            event.documentId !==
                activeDocument.id
        ) {
            return;
        }

        const pageNumber =
            event.sessionState
                ? event.sessionState.activePage
                : null;

        if (
            !Number.isInteger(pageNumber)
        ) {
            return;
        }

        this.thumbnailRenderer
            .setActivePage(
                pageNumber
            );

    }

    render() {

        if (
            !this.element ||
            this.destroyed
        ) {
            return this;
        }

        const requestId =
            ++this.renderRequestId;

        this.thumbnailRenderer
            .invalidate();

        this.clearElement();

        this.thumbnailContainer =
            null;

        const title =
            window.document.createElement(
                "h2"
            );

        title.textContent =
            "Pages";

        this.element.appendChild(
            title
        );

        const activeDocument =
            this.getActiveDocument();

        if (!activeDocument) {

            this.renderEmptyState();

            return this;

        }

        const session =
            this.getActiveDocumentSession();

        if (!session) {

            this.renderSessionUnavailable();

            return this;

        }

        if (session.isDestroyed()) {

            this.renderSessionUnavailable();

            return this;

        }

        this.thumbnailContainer =
            window.document.createElement(
                "div"
            );

        this.thumbnailContainer.dataset.qcRole =
            "thumbnail-content";

        this.element.appendChild(
            this.thumbnailContainer
        );

        this.renderDocumentThumbnails(
            requestId,
            activeDocument,
            session
        );

        return this;

    }

    async renderDocumentThumbnails(
        requestId,
        activeDocument,
        session
    ) {

        const activePage =
            session.getActivePage();

        const initialPage =
            Number.isInteger(activePage)
                ? activePage
                : 1;

        const pageOrder =
            session.getPageOrder();

        await this.thumbnailRenderer.render(
            this.thumbnailContainer,
            activeDocument,
            {

                activePage:
                    initialPage,

                pageOrder,

                rearrangeEnabled:
                    true,

                onPageClick:
                    pageNumber => {

                        this.requestActivePage(
                            activeDocument.id,
                            pageNumber
                        );

                    },

                onPageMove:
                    ({
                        fromIndex,
                        toIndex
                    }) => {

                        this.requestPageMove(
                            activeDocument.id,
                            fromIndex,
                            toIndex
                        );

                    },

                onDocumentReady:
                    ({
                        pageCount
                    }) => {

                        this.handleDocumentReady(
                            requestId,
                            activeDocument.id,
                            pageCount
                        );

                    },

                onError:
                    error => {

                        this.handleThumbnailError(
                            requestId,
                            activeDocument.id,
                            error
                        );

                    }

            }
        );

    }

    handleDocumentReady(
        requestId,
        documentId,
        pageCount
    ) {

        if (
            !this.isCurrentRequest(
                requestId,
                documentId
            )
        ) {
            return;
        }

        const session =
            this.store.getDocumentSession(
                documentId
            );

        if (
            !session ||
            session.isDestroyed()
        ) {
            return;
        }

        if (
            session.getPageCount() !==
                pageCount
        ) {

            session.initializePages(
                pageCount
            );

            return;

        }

        this.thumbnailRenderer
            .setPageOrder(
                session.getPageOrder()
            );

        const activePage =
            session.getActivePage();

        if (
            Number.isInteger(activePage)
        ) {

            this.thumbnailRenderer
                .setActivePage(
                    activePage
                );

        }

    }

    requestActivePage(
        documentId,
        pageNumber
    ) {

        const activeDocument =
            this.getActiveDocument();

        if (
            !activeDocument ||
            activeDocument.id !==
                documentId
        ) {
            return;
        }

        const session =
            this.store.getDocumentSession(
                documentId
            );

        if (
            !session ||
            session.isDestroyed()
        ) {
            return;
        }

        if (
            session.getPageCount() < 1
        ) {
            return;
        }

        session.setActivePage(
            pageNumber
        );

    }

    requestPageMove(
        documentId,
        fromIndex,
        toIndex
    ) {

        const activeDocument =
            this.getActiveDocument();

        if (
            !activeDocument ||
            activeDocument.id !==
                documentId
        ) {
            return;
        }

        const session =
            this.store.getDocumentSession(
                documentId
            );

        if (
            !session ||
            session.isDestroyed()
        ) {
            return;
        }

        if (
            session.getPageCount() < 1
        ) {
            return;
        }

        if (
            !Number.isInteger(fromIndex) ||
            !Number.isInteger(toIndex)
        ) {
            return;
        }

        try {

            session.movePage(
                fromIndex,
                toIndex
            );

            this.thumbnailRenderer
                .setPageOrder(
                    session.getPageOrder()
                );

        } catch (error) {

            session.setError(
                error
            );

        }

    }

    handleThumbnailError(
        requestId,
        documentId,
        error
    ) {

        if (
            !this.isCurrentRequest(
                requestId,
                documentId
            )
        ) {
            return;
        }

        const session =
            this.store.getDocumentSession(
                documentId
            );

        if (
            !session ||
            session.isDestroyed()
        ) {
            return;
        }

        session.setError(
            error
        );

    }

    isCurrentRequest(
        requestId,
        documentId
    ) {

        if (
            this.destroyed ||
            requestId !==
                this.renderRequestId
        ) {
            return false;
        }

        const activeDocument =
            this.getActiveDocument();

        if (
            !activeDocument ||
            activeDocument.id !==
                documentId
        ) {
            return false;
        }

        const session =
            this.store.getDocumentSession(
                documentId
            );

        return Boolean(
            session &&
            !session.isDestroyed()
        );

    }

    renderEmptyState() {

        const message =
            window.document.createElement(
                "p"
            );

        message.textContent =
            "No document selected.";

        this.element.appendChild(
            message
        );

    }

    renderSessionUnavailable() {

        const message =
            window.document.createElement(
                "p"
            );

        message.dataset.qcRole =
            "thumbnail-error";

        message.textContent =
            "The document session is unavailable.";

        this.element.appendChild(
            message
        );

    }

    destroy() {

        if (this.destroyed) {
            return this;
        }

        this.renderRequestId +=
            1;

        this.thumbnailRenderer
            .destroy();

        this.workspace.off(
            WorkspaceEvents.STORE_CHANGED,
            this.handleStoreChanged
        );

        this.workspace.off(
            WorkspaceEvents.DOCUMENT_SESSION_CHANGED,
            this.handleDocumentSessionChanged
        );

        this.workspace.off(
            WorkspaceEvents.ACTIVE_PAGE_CHANGED,
            this.handleActivePageChanged
        );

        this.thumbnailContainer =
            null;

        return super.destroy();

    }

}