import {
    WorkspaceEvents
} from "../workspace/workspaceEvents.js";

import {
    WorkspaceZone
} from "./workspaceZone.js";

import {
    renderToolOptions
} from "../../ui/toolOptionsView.js";

export class ToolZone extends WorkspaceZone {

    constructor(
        workspace,
        tool
    ) {

        super(
            workspace,
            "tool"
        );

        if (
            typeof tool !== "string" ||
            tool.trim() === ""
        ) {
            throw new TypeError(
                "ToolZone requires a valid tool name."
            );
        }

        this.tool =
            tool.trim();

        this.optionsView =
            null;

        this.pageOrderOutput =
            null;

        this.handleStoreChanged =
            this.handleStoreChanged.bind(this);

        this.handleDocumentSessionChanged =
            this.handleDocumentSessionChanged.bind(this);

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

        this.render();

        return this;

    }

    render() {

        super.render();

        const element =
            this.getElement();

        this.destroyOptionsView();

        element.replaceChildren();

        element.dataset.qcRole =
            "tool-options-zone";

        const header =
            document.createElement("header");

        header.className =
            "qc-tool-zone__header";

        const title =
            document.createElement("h2");

        title.className =
            "qc-tool-zone__title";

        title.textContent =
            "Tool options";

        const toolName =
            document.createElement("p");

        toolName.className =
            "qc-tool-zone__tool-name";

        toolName.dataset.qcRole =
            "active-tool-name";

        toolName.textContent =
            this.tool;

        header.append(
            title,
            toolName
        );

        const optionsContainer =
            document.createElement("div");

        optionsContainer.className =
            "qc-tool-options-container";

        optionsContainer.dataset.qcRole =
            "tool-options";

        element.append(
            header,
            optionsContainer
        );

        if (this.tool === "rearrange") {

            this.renderRearrangeOptions(
                optionsContainer
            );

        } else {

            this.optionsView =
                renderToolOptions(
                    optionsContainer,
                    this.tool
                );

        }

        return this;

    }

    renderRearrangeOptions(container) {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "qc-tool-options qc-rearrange-options";

        const description =
            document.createElement("p");

        description.textContent =
            "Drag the page thumbnails into the required order.";

        const orderTitle =
            document.createElement("h3");

        orderTitle.textContent =
            "Current page order";

        this.pageOrderOutput =
            document.createElement("div");

        this.pageOrderOutput.className =
            "qc-page-order-output";

        this.pageOrderOutput.dataset.qcRole =
            "current-page-order";

        wrapper.append(
            description,
            orderTitle,
            this.pageOrderOutput
        );

        container.appendChild(
            wrapper
        );

        this.updateRearrangeOptions();

        this.optionsView = {
            getOptions: () =>
                this.getRearrangeOptions(),

            destroy: () => {

                this.pageOrderOutput =
                    null;

                container.replaceChildren();

            }
        };

    }

    updateRearrangeOptions() {

        if (
            this.tool !== "rearrange" ||
            !this.pageOrderOutput
        ) {
            return this;
        }

        const session =
            this.store.getActiveDocumentSession();

        if (
            !session ||
            session.isDestroyed() ||
            session.getPageCount() < 1
        ) {

            this.pageOrderOutput.textContent =
                "Upload one PDF file to load its page order.";

            return this;

        }

        const pageOrder =
            session.getPageOrder();

        this.pageOrderOutput.textContent =
            pageOrder.join(", ");

        return this;

    }

    getRearrangeOptions() {

        const session =
            this.store.getActiveDocumentSession();

        if (
            !session ||
            session.isDestroyed()
        ) {
            throw new Error(
                "Rearrange requires one active PDF document."
            );
        }

        if (session.getPageCount() < 1) {
            throw new Error(
                "PDF pages have not finished loading."
            );
        }

        const pageOrder =
            session.getPageOrder();

        if (pageOrder.length < 1) {
            throw new Error(
                "A valid page order is required."
            );
        }

        return {
            pageOrder: [
                ...pageOrder
            ]
        };

    }

    handleStoreChanged() {

        if (this.destroyed) {
            return;
        }

        this.updateRearrangeOptions();

    }

    handleDocumentSessionChanged(event) {

        if (
            this.destroyed ||
            this.tool !== "rearrange" ||
            !event ||
            typeof event !== "object"
        ) {
            return;
        }

        const activeDocument =
            this.store.getActiveDocument();

        if (
            !activeDocument ||
            event.documentId !==
                activeDocument.id
        ) {
            return;
        }

        this.updateRearrangeOptions();

    }

    getTool() {

        return this.tool;

    }

    getOptions() {

        if (
            !this.optionsView ||
            typeof this.optionsView.getOptions !==
                "function"
        ) {
            return {};
        }

        const options =
            this.optionsView.getOptions();

        if (
            !options ||
            typeof options !== "object" ||
            Array.isArray(options)
        ) {
            return {};
        }

        return {
            ...options
        };

    }

    destroyOptionsView() {

        if (
            this.optionsView &&
            typeof this.optionsView.destroy ===
                "function"
        ) {
            this.optionsView.destroy();
        }

        this.optionsView =
            null;

        this.pageOrderOutput =
            null;

        return this;

    }

    destroy() {

        if (this.isDestroyed()) {
            return this;
        }

        this.workspace.off(
            WorkspaceEvents.STORE_CHANGED,
            this.handleStoreChanged
        );

        this.workspace.off(
            WorkspaceEvents.DOCUMENT_SESSION_CHANGED,
            this.handleDocumentSessionChanged
        );

        this.destroyOptionsView();

        super.destroy();

        this.tool =
            null;

        return this;

    }

}