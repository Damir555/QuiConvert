export class WorkspaceZone {

    constructor(workspace, zoneName) {

        if (
            !workspace ||
            typeof workspace !== "object"
        ) {
            throw new TypeError(
                "WorkspaceZone requires a WorkspaceEngine instance."
            );
        }

        if (
            typeof zoneName !== "string" ||
            zoneName.trim() === ""
        ) {
            throw new TypeError(
                "WorkspaceZone requires a valid zone name."
            );
        }

        this.workspace =
            workspace;

        this.zoneName =
            zoneName.trim();

        this.store =
            this.resolveStore();

        this.selectionManager =
            this.resolveSelectionManager();

        this.element = null;

        this.initialized = false;
        this.destroyed = false;
    }

    initialize() {

        if (this.initialized) {
            return this;
        }

        this.assertNotDestroyed();

        this.element =
            this.resolveZoneElement();

        this.destroyed =
            false;

        this.initialized =
            true;

        //
        // VAŽNO:
        // DOM mora postojati prije registracije event listenera.
        //
        this.render();

        this.bindEvents();

        return this;
    }

    render() {

        this.assertInitialized();
        this.assertNotDestroyed();

        return this;
    }

    bindEvents() {

        return this;

    }

    unbindEvents() {

        return this;

    }

    getWorkspace() {

        return this.workspace;
    }

    getStore() {

        return this.store;
    }

    getSelectionManager() {

        return this.selectionManager;
    }

    getZoneName() {

        return this.zoneName;
    }

    getElement() {

        return this.element;
    }

    getLayout() {

        if (
            !this.workspace ||
            typeof this.workspace.getLayout !==
                "function"
        ) {
            throw new Error(
                "WorkspaceEngine does not provide a WorkspaceLayout."
            );
        }

        const layout =
            this.workspace.getLayout();

        if (!layout) {
            throw new Error(
                "WorkspaceLayout is unavailable."
            );
        }

        return layout;
    }

    getActiveDocument() {

        if (
            !this.store ||
            typeof this.store.getActiveDocument !==
                "function"
        ) {
            return null;
        }

        return this.store
            .getActiveDocument();
    }

    getActiveDocumentSession() {

        if (
            !this.store ||
            typeof this.store
                .getActiveDocumentSession !==
                "function"
        ) {
            return null;
        }

        return this.store
            .getActiveDocumentSession();
    }

    isInitialized() {

        return this.initialized;
    }

    isDestroyed() {

        return this.destroyed;
    }

    clearElement() {

        if (this.element) {
            this.element.innerHTML = "";
        }

        return this;
    }

    assertInitialized() {

        if (!this.initialized) {
            throw new Error(
                `${this.constructor.name} has not been initialized.`
            );
        }
    }

    assertNotDestroyed() {

        if (this.destroyed) {
            throw new Error(
                `${this.constructor.name} has been destroyed.`
            );
        }
    }

    destroy() {

        if (this.destroyed) {
            return this;
        }

        this.unbindEvents();

        this.destroyed =
            true;

        this.clearElement();

        this.element =
            null;

        this.initialized =
            false;

        return this;
    }

    resolveStore() {

        if (
            typeof this.workspace.getStore !==
                "function"
        ) {
            throw new Error(
                "WorkspaceEngine does not provide a WorkspaceStore."
            );
        }

        const store =
            this.workspace.getStore();

        if (!store) {
            throw new Error(
                "WorkspaceStore is unavailable."
            );
        }

        return store;
    }

    resolveSelectionManager() {

        if (
            typeof this.workspace
                .getSelectionManager !==
                "function"
        ) {
            return null;
        }

        return this.workspace
            .getSelectionManager();
    }

    resolveZoneElement() {

        const layout =
            this.getLayout();

        if (
            typeof layout.getZone !==
                "function"
        ) {
            throw new Error(
                "WorkspaceLayout does not support zone lookup."
            );
        }

        const element =
            layout.getZone(
                this.zoneName
            );

        if (!element) {
            throw new Error(
                `${this.constructor.name} element was not found for zone "${this.zoneName}".`
            );
        }

        return element;
    }

}