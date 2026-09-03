import {
    WorkspaceEvents
} from "../workspace/workspaceEvents.js";

export class FilesZone {

    constructor(workspace) {

        if (!workspace) {
            throw new TypeError(
                "FilesZone requires a WorkspaceEngine instance."
            );
        }

        this.workspace = workspace;
        this.element = null;

        this.initialized = false;
        this.destroyed = false;

        this.handleStoreChanged =
            this.handleStoreChanged.bind(this);

        this.handleDocumentClick =
            this.handleDocumentClick.bind(this);

        this.handleRemoveDocumentClick =
            this.handleRemoveDocumentClick.bind(this);

    }

    initialize() {

        if (this.initialized) {
            return this;
        }

        if (this.destroyed) {
            throw new Error(
                "Destroyed FilesZone cannot be initialized again."
            );
        }

        const layout =
            this.workspace.getLayout();

        this.element =
            layout.getZone("files");

        if (!this.element) {
            throw new Error(
                "Files Zone element was not found."
            );
        }

        this.bindEvents();
        this.render();

        this.initialized = true;

        return this;

    }

    bindEvents() {

        this.workspace.on(
            WorkspaceEvents.STORE_CHANGED,
            this.handleStoreChanged
        );

        return this;

    }

    unbindEvents() {

        this.workspace.off(
            WorkspaceEvents.STORE_CHANGED,
            this.handleStoreChanged
        );

        return this;

    }

    handleStoreChanged() {

        if (!this.initialized || this.destroyed) {
            return;
        }

        this.render();

    }

    handleDocumentClick(event) {

        const control =
            event.currentTarget;

        const documentId =
            control.dataset.documentId;

        if (!documentId) {
            return;
        }

        this.workspace
            .getStore()
            .setActiveDocument(documentId);

    }

    handleRemoveDocumentClick(event) {

        event.preventDefault();
        event.stopPropagation();

        const button =
            event.currentTarget;

        const documentId =
            button.dataset.documentId;

        if (!documentId) {
            return;
        }

        this.workspace
            .getStore()
            .removeDocument(documentId);

    }

    getDocuments() {

        return this.workspace
            .getStore()
            .getDocuments();

    }

    getActiveDocument() {

        return this.workspace
            .getStore()
            .getActiveDocument();

    }

    render() {

        if (!this.element) {
            return this;
        }

        this.element.replaceChildren();

        const documents =
            this.getDocuments();

        const activeDocument =
            this.getActiveDocument();

        const heading =
            document.createElement("div");

        heading.className =
            "qc-files__heading";

        const title =
            document.createElement("h2");

        title.textContent =
            "Files";

        const count =
            document.createElement("span");

        count.className =
            "qc-files__count";

        count.textContent =
            `${documents.length}`;

        count.setAttribute(
            "aria-label",
            `${documents.length} selected ${
                documents.length === 1
                    ? "document"
                    : "documents"
            }`
        );

        heading.append(
            title,
            count
        );

        this.element.appendChild(
            heading
        );

        if (documents.length === 0) {

            const emptyMessage =
                document.createElement("p");

            emptyMessage.className =
                "qc-files__empty";

            emptyMessage.textContent =
                "No documents selected.";

            this.element.appendChild(
                emptyMessage
            );

            return this;

        }

        const list =
            document.createElement("ul");

        list.dataset.qcRole =
            "files-list";

        list.className =
            "qc-files__list";

        for (
            const workspaceDocument
            of documents
        ) {

            const item =
                document.createElement("li");

            item.className =
                "qc-files__item";

            item.dataset.documentId =
                workspaceDocument.id;

            const isActive =
                Boolean(
                    activeDocument &&
                    activeDocument.id ===
                        workspaceDocument.id
                );

            if (isActive) {
                item.classList.add(
                    "qc-files__item--active"
                );
            }

            const selectButton =
                document.createElement("button");

            selectButton.type =
                "button";

            selectButton.className =
                "qc-files__select";

            selectButton.dataset.documentId =
                workspaceDocument.id;

            selectButton.setAttribute(
                "aria-pressed",
                String(isActive)
            );

            selectButton.setAttribute(
                "aria-label",
                `Select ${workspaceDocument.name}`
            );

            selectButton.addEventListener(
                "click",
                this.handleDocumentClick
            );

            const icon =
                document.createElement("span");

            icon.className =
                "qc-files__icon";

            icon.setAttribute(
                "aria-hidden",
                "true"
            );

            icon.textContent =
                "PDF";

            const details =
                document.createElement("span");

            details.className =
                "qc-files__details";

            const name =
                document.createElement("span");

            name.className =
                "qc-files__name";

            name.textContent =
                workspaceDocument.name;

            name.title =
                workspaceDocument.name;

            const metadata =
                document.createElement("span");

            metadata.className =
                "qc-files__metadata";

            metadata.textContent =
                this.createMetadataText(
                    workspaceDocument
                );

            details.append(
                name,
                metadata
            );

            selectButton.append(
                icon,
                details
            );

            const removeButton =
                document.createElement("button");

            removeButton.type =
                "button";

            removeButton.className =
                "qc-files__remove";

            removeButton.dataset.documentId =
                workspaceDocument.id;

            removeButton.textContent =
                "×";

            removeButton.title =
                `Remove ${workspaceDocument.name}`;

            removeButton.setAttribute(
                "aria-label",
                `Remove ${workspaceDocument.name}`
            );

            removeButton.addEventListener(
                "click",
                this.handleRemoveDocumentClick
            );

            item.append(
                selectButton,
                removeButton
            );

            list.appendChild(item);

        }

        this.element.appendChild(list);

        return this;

    }

    createMetadataText(workspaceDocument) {

        const metadata = [
            this.formatFileSize(
                workspaceDocument.size
            )
        ];

        const pageCount =
            workspaceDocument.pageCount;

        if (
            Number.isInteger(pageCount) &&
            pageCount > 0
        ) {
            metadata.push(
                `${pageCount} ${
                    pageCount === 1
                        ? "page"
                        : "pages"
                }`
            );
        }

        return metadata.join(" · ");

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

        if (kilobytes < 1024) {
            return `${kilobytes.toFixed(1)} KB`;
        }

        const megabytes =
            kilobytes / 1024;

        return `${megabytes.toFixed(2)} MB`;

    }

    destroy() {

        if (this.destroyed) {
            return this;
        }

        if (this.initialized) {
            this.unbindEvents();
        }

        if (this.element) {
            this.element.replaceChildren();
        }

        this.element = null;
        this.initialized = false;
        this.destroyed = true;

        return this;

    }

}
