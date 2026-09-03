import {
    PreviewRenderer
} from "../renderers/previewRenderer.js";

export class PreviewController {

    constructor(store, options = {}) {
        if (!store) {
            throw new TypeError(
                "PreviewController requires a WorkspaceStore instance."
            );
        }

        if (
            options === null ||
            typeof options !== "object" ||
            Array.isArray(options)
        ) {
            throw new TypeError(
                "PreviewController options must be an object."
            );
        }

        this.store =
            store;

        this.renderer =
            options.renderer instanceof PreviewRenderer
                ? options.renderer
                : new PreviewRenderer();

        this.onSessionUpdated =
            typeof options.onSessionUpdated === "function"
                ? options.onSessionUpdated
                : null;

        this.requestToken = 0;
        this.container = null;
        this.documentId = null;
        this.destroyed = false;
    }

    async render(
        container,
        workspaceDocument,
        session
    ) {
        if (!(container instanceof HTMLElement)) {
            throw new TypeError(
                "PreviewController requires a valid container element."
            );
        }

        if (
            !workspaceDocument ||
            typeof workspaceDocument !== "object"
        ) {
            throw new TypeError(
                "PreviewController requires a valid WorkspaceDocument."
            );
        }

        if (
            !session ||
            typeof session.isDestroyed !== "function" ||
            session.isDestroyed()
        ) {
            return false;
        }

        this.destroyed =
            false;

        const token =
            ++this.requestToken;

        this.renderer.invalidate();

        this.container =
            container;

        this.documentId =
            workspaceDocument.id;

        if (
            session.getStatus() === "idle"
        ) {
            session.setLoading();
        }

        const activePage =
            session.getActivePage();

        const initialPage =
            Number.isInteger(activePage)
                ? activePage
                : 1;

        await this.renderer.render(
            container,
            workspaceDocument,
            {
                pageNumber:
                    initialPage,

                onDocumentReady:
                    ({ pageCount }) => {
                        this.handleDocumentReady(
                            token,
                            workspaceDocument.id,
                            pageCount
                        );
                    },

                onPreviousPage:
                    pageNumber => {
                        this.requestActivePage(
                            token,
                            workspaceDocument.id,
                            pageNumber
                        );
                    },

                onNextPage:
                    pageNumber => {
                        this.requestActivePage(
                            token,
                            workspaceDocument.id,
                            pageNumber
                        );
                    },

                onError:
                    error => {
                        this.handlePreviewError(
                            token,
                            workspaceDocument.id,
                            error
                        );
                    }
            }
        );

        return this.isCurrentRequest(
            token,
            workspaceDocument.id
        );
    }

    handleDocumentReady(
        token,
        documentId,
        pageCount
    ) {
        const session =
            this.getCurrentSession(
                token,
                documentId
            );

        if (!session) {
            return false;
        }

        if (
            session.getPageCount() !==
            pageCount
        ) {
            session.initializePages(
                pageCount
            );
        }

        this.setContainerBusy(
            false
        );

        this.notifySessionUpdated(
            session
        );

        return true;
    }

    requestActivePage(
        token,
        documentId,
        pageNumber
    ) {
        const session =
            this.getCurrentSession(
                token,
                documentId
            );

        if (!session) {
            return false;
        }

        session.setActivePage(
            pageNumber
        );

        return true;
    }

    handlePreviewError(
        token,
        documentId,
        error
    ) {
        const session =
            this.getCurrentSession(
                token,
                documentId
            );

        if (!session) {
            return false;
        }

        session.setError(
            error
        );

        this.setContainerBusy(
            false
        );

        this.notifySessionUpdated(
            session
        );

        return true;
    }

    async setCurrentPage(pageNumber) {
        if (this.destroyed) {
            return false;
        }

        return this.renderer.setCurrentPage(
            pageNumber
        );
    }

    getCurrentSession(
        token,
        documentId
    ) {
        if (
            !this.isCurrentRequest(
                token,
                documentId
            )
        ) {
            return null;
        }

        const session =
            this.store.getDocumentSession(
                documentId
            );

        if (
            !session ||
            session.isDestroyed()
        ) {
            return null;
        }

        return session;
    }

    isCurrentRequest(
        token,
        documentId
    ) {
        if (
            this.destroyed ||
            token !== this.requestToken ||
            documentId !== this.documentId
        ) {
            return false;
        }

        const activeDocument =
            this.store.getActiveDocument();

        return Boolean(
            activeDocument &&
            activeDocument.id === documentId
        );
    }

    setContainerBusy(isBusy) {
        if (!this.container) {
            return false;
        }

        this.container.setAttribute(
            "aria-busy",
            isBusy ? "true" : "false"
        );

        return true;
    }

    notifySessionUpdated(session) {
        if (this.onSessionUpdated) {
            this.onSessionUpdated(
                session
            );
        }
    }

    invalidate() {
        this.requestToken += 1;

        this.renderer.invalidate();

        this.container = null;
        this.documentId = null;

        return this;
    }

    destroy() {
        if (this.destroyed) {
            return this;
        }

        this.destroyed = true;
        this.requestToken += 1;

        this.renderer.destroy();

        this.container = null;
        this.documentId = null;
        this.onSessionUpdated = null;

        return this;
    }
}
