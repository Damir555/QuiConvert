export const WorkspaceEvents = Object.freeze({

    /*
     * Workspace lifecycle
     */

    INITIALIZED:
        "workspace.initialized",

    STATE_CHANGED:
        "workspace.stateChanged",

    RESET:
        "workspace.reset",

    /*
     * Document lifecycle
     */

    DOCUMENTS_SELECTED:
        "workspace.documentsSelected",

    STORE_CHANGED:
        "workspace.storeChanged",

    DOCUMENT_SESSION_CREATED:
        "workspace.documentSessionCreated",

    DOCUMENT_SESSION_DESTROYED:
        "workspace.documentSessionDestroyed",

    DOCUMENT_SESSION_CHANGED:
        "workspace.documentSessionChanged",

    /*
     * Selection / Navigation
     */

    SELECTION_CHANGED:
        "workspace.selectionChanged",

    ACTIVE_PAGE_CHANGED:
        "workspace.activePageChanged"

});