import {
    WorkspaceDocument
} from "../domain/index.js";

import {
    WorkspaceEvents
} from "../workspace/workspaceEvents.js";

import {
    WorkspaceZone
} from "./workspaceZone.js";

export class UploadZone extends WorkspaceZone {

    constructor(workspace) {

        super(
            workspace,
            "upload"
        );

        this.button = null;
        this.fileInput = null;
        this.description = null;
        this.status = null;
        this.dragCounter = 0;

        this.handleStoreChanged =
            this.handleStoreChanged.bind(this);

        this.handleZoneClick =
            this.handleZoneClick.bind(this);

        this.handleFileChange =
            this.handleFileChange.bind(this);

        this.handleDragEnter =
            this.handleDragEnter.bind(this);

        this.handleDragOver =
            this.handleDragOver.bind(this);

        this.handleDragLeave =
            this.handleDragLeave.bind(this);

        this.handleDrop =
            this.handleDrop.bind(this);

    }

    bindEvents() {

        this.getWorkspace().on(
            WorkspaceEvents.STORE_CHANGED,
            this.handleStoreChanged
        );

        const element =
            this.getElement();

        element.addEventListener(
            "click",
            this.handleZoneClick
        );

        element.addEventListener(
            "change",
            this.handleFileChange
        );

        element.addEventListener(
            "dragenter",
            this.handleDragEnter,
            true
        );

        element.addEventListener(
            "dragover",
            this.handleDragOver,
            true
        );

        element.addEventListener(
            "dragleave",
            this.handleDragLeave,
            true
        );

        element.addEventListener(
            "drop",
            this.handleDrop,
            true
        );

        return this;

    }

    unbindEvents() {

        this.getWorkspace().off(
            WorkspaceEvents.STORE_CHANGED,
            this.handleStoreChanged
        );

        const element =
            this.getElement();

        if (!element) {
            return this;
        }

        element.removeEventListener(
            "click",
            this.handleZoneClick
        );

        element.removeEventListener(
            "change",
            this.handleFileChange
        );

        element.removeEventListener(
            "dragenter",
            this.handleDragEnter,
            true
        );

        element.removeEventListener(
            "dragover",
            this.handleDragOver,
            true
        );

        element.removeEventListener(
            "dragleave",
            this.handleDragLeave,
            true
        );

        element.removeEventListener(
            "drop",
            this.handleDrop,
            true
        );

        return this;

    }

    render() {

        super.render();

        const element =
            this.getElement();

        this.resetDragState();
        element.replaceChildren();

        element.dataset.qcRole =
            "upload-drop-zone";

        const title =
            document.createElement("h2");

        title.textContent =
            "Upload PDF files";

        this.description =
            document.createElement("p");

        this.description.dataset.qcRole =
            "upload-description";

        this.setDescription(
            "Drag and drop PDF files here or choose them from your device."
        );

        this.button =
            document.createElement("button");

        this.button.type =
            "button";

        this.button.textContent =
            "Choose PDF files";

        this.button.dataset.qcRole =
            "upload-button";

        this.fileInput =
            document.createElement("input");

        this.fileInput.type =
            "file";

        this.fileInput.accept =
            "application/pdf,.pdf";

        this.fileInput.multiple =
            true;

        this.fileInput.hidden =
            true;

        this.fileInput.dataset.qcRole =
            "upload-input";

        this.status =
            document.createElement("p");

        this.status.dataset.qcRole =
            "upload-status";

        this.status.setAttribute(
            "role",
            "status"
        );

        this.status.setAttribute(
            "aria-live",
            "polite"
        );

        this.status.setAttribute(
            "aria-atomic",
            "true"
        );

        this.clearStatus();

        element.append(
            title,
            this.description,
            this.button,
            this.fileInput,
            this.status
        );

        this.refreshWorkspaceStatus();

        return this;

    }

    handleStoreChanged() {

        if (
            !this.isInitialized() ||
            this.isDestroyed()
        ) {
            return;
        }

        this.refreshWorkspaceStatus();

    }

    refreshWorkspaceStatus() {

        const documentCount =
            this.getStore()
                .getDocuments()
                .length;

        if (documentCount === 0) {
            this.setDescription(
                "Drag and drop PDF files here or choose them from your device."
            );

            this.clearStatus();

            return this;
        }

        const workspaceMessage =
            documentCount === 1
                ? "1 PDF file is currently in the workspace."
                : `${documentCount} PDF files are currently in the workspace.`;

        this.setDescription(
            workspaceMessage
        );

        this.setStatus(
            workspaceMessage,
            "success"
        );

        return this;

    }

    handleZoneClick(event) {

        const target =
            event.target;

        if (!(target instanceof Element)) {
            return;
        }

        const uploadButton =
            target.closest(
                '[data-qc-role="upload-button"]'
            );

        const element =
            this.getElement();

        if (
            !uploadButton ||
            !element.contains(uploadButton)
        ) {
            return;
        }

        this.fileInput?.click();

    }

    handleFileChange(event) {

        const target =
            event.target;

        if (!(target instanceof HTMLInputElement)) {
            return;
        }

        if (
            target.dataset.qcRole !==
            "upload-input"
        ) {
            return;
        }

        const files =
            Array.from(
                target.files ?? []
            );

        this.processFiles(files);

        // Omogućuje ponovno biranje iste datoteke.
        target.value = "";

    }

    handleDragEnter(event) {

        event.preventDefault();
        event.stopPropagation();

        this.dragCounter += 1;
        this.setDragActive(true);

    }

    handleDragOver(event) {

        event.preventDefault();
        event.stopPropagation();

        if (event.dataTransfer) {
            event.dataTransfer.dropEffect =
                "copy";
        }

        this.setDragActive(true);

    }

    handleDragLeave(event) {

        event.preventDefault();
        event.stopPropagation();

        this.dragCounter =
            Math.max(
                0,
                this.dragCounter - 1
            );

        if (this.dragCounter === 0) {
            this.setDragActive(false);
        }

    }

    handleDrop(event) {

        event.preventDefault();
        event.stopPropagation();

        this.resetDragState();

        const files =
            Array.from(
                event.dataTransfer?.files ?? []
            );

        this.processFiles(files);

    }

    setDragActive(active) {

        const element =
            this.getElement();

        if (!element) {
            return this;
        }

        const isActive =
            Boolean(active);

        element.classList.toggle(
            "qc-workspace__zone--drag-active",
            isActive
        );

        element.dataset.qcDragState =
            isActive
                ? "active"
                : "idle";

        if (isActive) {
            this.setDescription(
                "Drop PDF files to add them."
            );
        } else {
            this.refreshWorkspaceStatus();
        }

        return this;

    }

    resetDragState() {

        this.dragCounter = 0;
        this.setDragActive(false);

        return this;

    }

    setDescription(message) {

        if (!this.description) {
            return this;
        }

        this.description.textContent =
            String(message);

        return this;

    }

    setStatus(message, type = "info") {

        if (!this.status) {
            return this;
        }

        const normalizedType =
            String(type).toLowerCase();

        this.status.textContent =
            String(message);

        this.status.dataset.qcStatus =
            normalizedType;

        this.status.className =
            `qc-upload-zone__status qc-upload-zone__status--${normalizedType}`;

        return this;

    }

    clearStatus() {

        if (!this.status) {
            return this;
        }

        this.status.textContent = "";
        this.status.dataset.qcStatus = "idle";
        this.status.className =
            "qc-upload-zone__status";

        return this;

    }

    processFiles(files) {

        if (!Array.isArray(files)) {
            throw new TypeError(
                "UploadZone.processFiles requires an array of files."
            );
        }

        if (files.length === 0) {
            this.setStatus(
                "No files were selected.",
                "warning"
            );

            return this;
        }

        const pdfFiles =
            files.filter(file => {

                if (!(file instanceof File)) {
                    return false;
                }

                const extension =
                    file.name
                        .split(".")
                        .pop()
                        ?.toLowerCase();

                return (
                    file.type ===
                        "application/pdf" ||
                    extension ===
                        "pdf"
                );

            });

        const rejectedCount =
            files.length - pdfFiles.length;

        if (pdfFiles.length === 0) {

            console.warn(
                "No valid PDF files were selected."
            );

            this.setStatus(
                rejectedCount === 1
                    ? "The selected file is not a PDF."
                    : `${rejectedCount} selected files are not PDFs.`,
                "warning"
            );

            return this;

        }

        const documents =
            pdfFiles.map(
                file =>
                    new WorkspaceDocument(file)
            );

        this.getStore().addDocuments(
            documents
        );

        const acceptedMessage =
            pdfFiles.length === 1
                ? "1 PDF file added."
                : `${pdfFiles.length} PDF files added.`;

        if (rejectedCount === 0) {
            this.refreshWorkspaceStatus();

            return this;
        }

        const rejectedMessage =
            rejectedCount === 1
                ? "1 unsupported file was ignored."
                : `${rejectedCount} unsupported files were ignored.`;

        this.setStatus(
            `${acceptedMessage} ${rejectedMessage}`,
            "warning"
        );

        return this;

    }

    getButton() {

        return this.button;

    }

    getFileInput() {

        return this.fileInput;

    }

    getStatus() {

        return this.status;

    }

    destroy() {

        if (this.isDestroyed()) {
            return this;
        }

        this.resetDragState();
        this.clearStatus();
        super.destroy();

        this.button = null;
        this.fileInput = null;
        this.description = null;
        this.status = null;

        return this;

    }

}
