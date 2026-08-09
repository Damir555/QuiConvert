import {
    WorkspaceEvents
} from "../../workspace/workspaceEvents.js";

import {
    PreviewController
} from "../controllers/previewController.js";

export class PreviewZone {

    constructor(workspace) {
        if (!workspace) {
            throw new TypeError(
                "PreviewZone requires a WorkspaceEngine instance."
            );
        }

        this.workspace =
            workspace;

        this.store =
            workspace.getStore();

        this.selectionManager =
            workspace.getSelectionManager();

        this.element = null;
        this.headerElement = null;
        this.previewContainer = null;
        this.detailsElement = null;
        this.statusElement = null;

        this.detailValueElements =
            new Map();

        this.previewController =
            new PreviewController(
                this.store,
                {
                    onSessionUpdated:
                        session => {
                            this.refreshSessionDetails(
                                session
                            );
                        }
                }
            );

        this.renderRequestId = 0;
        this.initialized = false;
        this.destroyed = false;

        this.handleStoreChanged =
            this.handleStoreChanged.bind(this);

        this.handleSelectionChanged =
            this.handleSelectionChanged.bind(this);

        this.handleDocumentSessionChanged =
            this.handleDocumentSessionChanged.bind(this);

        this.handleActivePageChanged =
            this.handleActivePageChanged.bind(this);
    }

    initialize() {
        if (this.initialized) {
            return this;
        }

        const layout =
            this.workspace.getLayout();

        this.element =
            layout.getZone("preview");

        if (!this.element) {
            throw new Error(
                "Preview Zone element was not found."
            );
        }

        this.destroyed =
            false;

        this.workspace.on(
            WorkspaceEvents.STORE_CHANGED,
            this.handleStoreChanged
        );

        this.workspace.on(
            WorkspaceEvents.SELECTION_CHANGED,
            this.handleSelectionChanged
        );

        this.workspace.on(
            WorkspaceEvents
                .DOCUMENT_SESSION_CHANGED,
            this.handleDocumentSessionChanged
        );

        this.workspace.on(
            WorkspaceEvents
                .ACTIVE_PAGE_CHANGED,
            this.handleActivePageChanged
        );

        this.initialized =
            true;

        this.render();

        return this;
    }

    handleStoreChanged() {
        if (this.destroyed) {
            return;
        }

        this.render();
    }

    handleSelectionChanged(selection) {
        if (this.destroyed) {
            return;
        }

        /*
         * Selection and active page are intentionally
         * separate concepts.
         *
         * Preview navigation is controlled by
         * DocumentSession.activePage.
         *
         * Selection events remain available for future
         * page-selection, thumbnail, and tool workflows.
         */
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

        this.refreshSessionDetails(
            session
        );
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

        this.previewController.setCurrentPage(
            pageNumber
        );

        const session =
            this.getActiveDocumentSession();

        if (
            session &&
            !session.isDestroyed()
        ) {
            this.refreshSessionDetails(
                session
            );
        }
    }

    getActiveDocument() {
        return this.store
            .getActiveDocument();
    }

    getActiveDocumentSession() {
        return this.store
            .getActiveDocumentSession();
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

        this.previewController.invalidate();

        this.element.innerHTML = "";
        this.element.classList.add(
            "qc-preview"
        );
        this.element.dataset.qcRole =
            "preview-zone";
        this.element.setAttribute(
            "aria-labelledby",
            "qc-preview-heading"
        );

        this.headerElement = null;
        this.previewContainer = null;
        this.detailsElement = null;
        this.statusElement = null;

        this.detailValueElements.clear();

        const activeDocument =
            this.getActiveDocument();

        const session =
            this.getActiveDocumentSession();

        this.renderHeader(
            activeDocument,
            session
        );

        if (!activeDocument) {
            this.renderEmptyState();

            return this;
        }

        if (!session) {
            this.renderSessionUnavailable();

            return this;
        }

        const content =
            window.document.createElement("div");

        content.className =
            "qc-preview__content";
        content.dataset.qcRole =
            "preview-layout";

        this.previewContainer =
            window.document.createElement("div");

        this.previewContainer.className =
            "qc-preview__stage";
        this.previewContainer.dataset.qcRole =
            "preview-content";
        this.previewContainer.setAttribute(
            "aria-label",
            `Preview of ${activeDocument.name}`
        );
        this.previewContainer.setAttribute(
            "aria-busy",
            "true"
        );

        this.renderLoadingState(
            this.previewContainer
        );

        content.appendChild(
            this.previewContainer
        );

        const detailsPanel =
            this.renderDocumentDetails(
                activeDocument,
                session
            );

        content.appendChild(
            detailsPanel
        );

        this.element.appendChild(
            content
        );

        this.renderDocumentPreview(
            requestId,
            activeDocument,
            session
        );

        return this;
    }

    renderHeader(
        activeDocument,
        session
    ) {
        this.headerElement =
            window.document.createElement("header");

        this.headerElement.className =
            "qc-preview__header";

        const headingGroup =
            window.document.createElement("div");

        headingGroup.className =
            "qc-preview__heading-group";

        const title =
            window.document.createElement("h2");

        title.id =
            "qc-preview-heading";
        title.className =
            "qc-preview__title";
        title.textContent =
            "Preview";

        headingGroup.appendChild(
            title
        );

        if (activeDocument) {
            const fileName =
                window.document.createElement("p");

            fileName.className =
                "qc-preview__filename";
            fileName.textContent =
                activeDocument.name;
            fileName.title =
                activeDocument.name;

            headingGroup.appendChild(
                fileName
            );
        }

        this.headerElement.appendChild(
            headingGroup
        );

        if (session) {
            this.statusElement =
                window.document.createElement("span");

            this.statusElement.dataset.qcRole =
                "preview-status";
            this.statusElement.setAttribute(
                "role",
                "status"
            );
            this.statusElement.setAttribute(
                "aria-live",
                "polite"
            );

            this.updateStatusElement(
                session.getStatus()
            );

            this.headerElement.appendChild(
                this.statusElement
            );
        }

        this.element.appendChild(
            this.headerElement
        );
    }

    renderLoadingState(container) {
        const loading =
            window.document.createElement("div");

        loading.className =
            "qc-preview-state qc-preview-state--loading";
        loading.dataset.qcRole =
            "preview-loading";
        loading.setAttribute(
            "role",
            "status"
        );
        loading.setAttribute(
            "aria-live",
            "polite"
        );

        const spinner =
            window.document.createElement("span");

        spinner.className =
            "qc-preview-state__spinner";
        spinner.setAttribute(
            "aria-hidden",
            "true"
        );

        const message =
            window.document.createElement("p");

        message.className =
            "qc-preview-state__title";
        message.textContent =
            "Loading PDF preview…";

        loading.append(
            spinner,
            message
        );

        container.appendChild(
            loading
        );
    }

    async renderDocumentPreview(
        requestId,
        activeDocument,
        session
    ) {
        if (
            requestId !== this.renderRequestId ||
            this.destroyed ||
            session.isDestroyed()
        ) {
            return false;
        }

        return this.previewController.render(
            this.previewContainer,
            activeDocument,
            session
        );
    }

    renderEmptyState() {
        const state =
            this.createStateCard({
                modifier:
                    "empty",
                icon:
                    "PDF",
                title:
                    "No document selected",
                description:
                    "Choose a PDF from the Files panel to display its preview."
            });

        this.element.appendChild(
            state
        );
    }

    renderSessionUnavailable() {
        const state =
            this.createStateCard({
                modifier:
                    "error",
                icon:
                    "!",
                title:
                    "Preview is unavailable",
                description:
                    "The document session could not be opened. Remove the file and upload it again."
            });

        state.dataset.qcRole =
            "preview-error";
        state.setAttribute(
            "role",
            "alert"
        );

        this.element.appendChild(
            state
        );
    }

    createStateCard({
        modifier,
        icon,
        title,
        description
    }) {
        const state =
            window.document.createElement("div");

        state.className =
            `qc-preview-state qc-preview-state--${modifier}`;

        const iconElement =
            window.document.createElement("span");

        iconElement.className =
            "qc-preview-state__icon";
        iconElement.textContent =
            icon;
        iconElement.setAttribute(
            "aria-hidden",
            "true"
        );

        const titleElement =
            window.document.createElement("p");

        titleElement.className =
            "qc-preview-state__title";
        titleElement.textContent =
            title;

        const descriptionElement =
            window.document.createElement("p");

        descriptionElement.className =
            "qc-preview-state__description";
        descriptionElement.textContent =
            description;

        state.append(
            iconElement,
            titleElement,
            descriptionElement
        );

        return state;
    }

    renderDocumentDetails(
        activeDocument,
        session
    ) {
        const panel =
            window.document.createElement("aside");

        panel.className =
            "qc-preview__details-panel";
        panel.setAttribute(
            "aria-labelledby",
            "qc-preview-details-heading"
        );

        const heading =
            window.document.createElement("h3");

        heading.id =
            "qc-preview-details-heading";
        heading.className =
            "qc-preview__details-title";
        heading.textContent =
            "Document details";

        this.detailsElement =
            window.document.createElement("dl");

        this.detailsElement.className =
            "qc-preview__details";
        this.detailsElement.dataset.qcRole =
            "preview-document-details";

        this.appendDetail(
            this.detailsElement,
            "name",
            "Name",
            activeDocument.name
        );

        this.appendDetail(
            this.detailsElement,
            "size",
            "Size",
            this.formatFileSize(
                activeDocument.size
            )
        );

        this.appendDetail(
            this.detailsElement,
            "type",
            "Type",
            activeDocument.type ||
                "Unknown"
        );

        this.appendDetail(
            this.detailsElement,
            "status",
            "Status",
            this.formatStatus(
                session.getStatus()
            )
        );

        this.appendDetail(
            this.detailsElement,
            "pageCount",
            "Pages",
            this.formatPageCount(
                session
            )
        );

        this.appendDetail(
            this.detailsElement,
            "activePage",
            "Active page",
            this.formatActivePage(
                session
            )
        );

        this.appendDetail(
            this.detailsElement,
            "revision",
            "Revision",
            session.getRevision()
        );

        this.appendDetail(
            this.detailsElement,
            "lastModified",
            "Last modified",
            this.formatLastModified(
                activeDocument.lastModified
            )
        );

        panel.append(
            heading,
            this.detailsElement
        );

        return panel;
    }

    refreshSessionDetails(session) {
        if (
            !session ||
            session.isDestroyed() ||
            !this.detailsElement
        ) {
            return this;
        }

        const status =
            session.getStatus();

        this.setDetailValue(
            "status",
            this.formatStatus(
                status
            )
        );

        this.setDetailValue(
            "pageCount",
            this.formatPageCount(
                session
            )
        );

        this.setDetailValue(
            "activePage",
            this.formatActivePage(
                session
            )
        );

        this.setDetailValue(
            "revision",
            session.getRevision()
        );

        this.updateStatusElement(
            status
        );

        return this;
    }

    updateStatusElement(status) {
        if (!this.statusElement) {
            return false;
        }

        const normalizedStatus =
            typeof status === "string" &&
            status.trim()
                ? status.trim().toLowerCase()
                : "idle";

        this.statusElement.className =
            `qc-preview__status qc-preview__status--${normalizedStatus}`;
        this.statusElement.textContent =
            this.formatStatus(
                normalizedStatus
            );

        return true;
    }

    formatStatus(status) {
        const normalizedStatus =
            typeof status === "string"
                ? status.trim().toLowerCase()
                : "";

        const labels = {
            idle:
                "Waiting",
            loading:
                "Loading",
            ready:
                "Ready",
            error:
                "Error"
        };

        return labels[normalizedStatus] ||
            (normalizedStatus
                ? normalizedStatus.charAt(0).toUpperCase() +
                    normalizedStatus.slice(1)
                : "Unknown");
    }

    setDetailValue(
        key,
        value
    ) {
        const element =
            this.detailValueElements.get(
                key
            );

        if (!element) {
            return false;
        }

        element.textContent =
            String(value ?? "");

        return true;
    }

    appendDetail(
        container,
        key,
        label,
        value
    ) {
        const item =
            window.document.createElement("div");

        item.className =
            "qc-preview__detail-item";

        const term =
            window.document.createElement("dt");

        term.className =
            "qc-preview__detail-label";
        term.textContent =
            label;

        const description =
            window.document.createElement("dd");

        description.className =
            "qc-preview__detail-value";
        description.dataset.qcDetail =
            key;
        description.textContent =
            String(value ?? "");

        this.detailValueElements.set(
            key,
            description
        );

        item.append(
            term,
            description
        );

        container.appendChild(
            item
        );
    }

    formatPageCount(session) {
        const pageCount =
            session.getPageCount();

        if (
            Number.isInteger(pageCount) &&
            pageCount > 0
        ) {
            return pageCount;
        }

        if (
            session.getStatus() === "error"
        ) {
            return "Unavailable";
        }

        return "Loading";
    }

    formatActivePage(session) {
        const activePage =
            session.getActivePage();

        if (
            Number.isInteger(activePage) &&
            activePage > 0
        ) {
            return activePage;
        }

        return "Unavailable";
    }

    formatFileSize(bytes) {
        if (
            !Number.isFinite(bytes) ||
            bytes <= 0
        ) {
            return "0 KB";
        }

        const kilobytes =
            bytes / 1024;

        if (
            kilobytes < 1024
        ) {
            return `${kilobytes.toFixed(1)} KB`;
        }

        const megabytes =
            kilobytes / 1024;

        return `${megabytes.toFixed(2)} MB`;
    }

    formatLastModified(timestamp) {
        if (
            !Number.isFinite(timestamp) ||
            timestamp <= 0
        ) {
            return "Unknown";
        }

        const date =
            new Date(timestamp);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "Unknown";
        }

        return date.toLocaleString();
    }

    destroy() {
        if (this.destroyed) {
            return this;
        }

        this.destroyed =
            true;

        this.renderRequestId += 1;

        this.previewController.destroy();

        this.workspace.off(
            WorkspaceEvents.STORE_CHANGED,
            this.handleStoreChanged
        );

        this.workspace.off(
            WorkspaceEvents.SELECTION_CHANGED,
            this.handleSelectionChanged
        );

        this.workspace.off(
            WorkspaceEvents.DOCUMENT_SESSION_CHANGED,
            this.handleDocumentSessionChanged
        );

        this.workspace.off(
            WorkspaceEvents.ACTIVE_PAGE_CHANGED,
            this.handleActivePageChanged
        );

        if (this.element) {
            this.element.innerHTML = "";
            this.element.classList.remove(
                "qc-preview"
            );
            this.element.removeAttribute(
                "data-qc-role"
            );
            this.element.removeAttribute(
                "aria-labelledby"
            );
        }

        this.detailValueElements.clear();

        this.headerElement = null;
        this.previewContainer = null;
        this.detailsElement = null;
        this.statusElement = null;
        this.element = null;

        this.initialized = false;

        return this;
    }
}
