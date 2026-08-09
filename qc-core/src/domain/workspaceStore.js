import {
    WorkspaceEvents
} from "../workspace/workspaceEvents.js";

import {
    DocumentSession
} from "./documentSession.js";

export class WorkspaceStore {

    constructor(eventBus) {
        if (!eventBus) {
            throw new Error(
                "WorkspaceStore requires an EventBus instance."
            );
        }

        this.eventBus =
            eventBus;

        this.documents = [];
        this.activeDocument = null;

        this.documentSessions =
            new Map();
    }

    setDocuments(documents) {
        this.validateDocuments(
            documents,
            "WorkspaceStore.setDocuments"
        );

        this.destroyAllDocumentSessions();

        this.documents = [
            ...documents
        ];

        this.createDocumentSessions(
            this.documents
        );

        this.activeDocument =
            this.documents.length > 0
                ? this.documents[0]
                : null;

        this.notifyChange();

        return this;
    }

    addDocuments(documents) {
        this.validateDocuments(
            documents,
            "WorkspaceStore.addDocuments"
        );

        const hadDocuments =
            this.hasDocuments();

        this.documents = [
            ...this.documents,
            ...documents
        ];

        this.createDocumentSessions(
            documents
        );

        if (
            !hadDocuments &&
            this.documents.length > 0
        ) {
            this.activeDocument =
                this.documents[0];
        }

        this.notifyChange();

        return this;
    }

    removeDocument(documentId) {
        if (
            typeof documentId !== "string" ||
            documentId.trim() === ""
        ) {
            throw new Error(
                "WorkspaceStore.removeDocument requires a document ID."
            );
        }

        const nextDocuments =
            this.documents.filter(
                document =>
                    document.id !== documentId
            );

        if (
            nextDocuments.length ===
            this.documents.length
        ) {
            return this;
        }

        this.destroyDocumentSession(
            documentId
        );

        this.documents =
            nextDocuments;

        if (
            this.activeDocument &&
            this.activeDocument.id === documentId
        ) {
            this.activeDocument =
                this.documents.length > 0
                    ? this.documents[0]
                    : null;
        }

        this.notifyChange();

        return this;
    }

    getDocuments() {
        return [
            ...this.documents
        ];
    }

    hasDocuments() {
        return (
            this.documents.length > 0
        );
    }

    setActiveDocument(documentId) {
        const document =
            this.documents.find(
                item =>
                    item.id === documentId
            );

        if (!document) {
            return this;
        }

        if (
            this.activeDocument &&
            this.activeDocument.id ===
                document.id
        ) {
            return this;
        }

        this.activeDocument =
            document;

        this.notifyChange();

        return this;
    }

    getActiveDocument() {
        return this.activeDocument;
    }

    getDocumentSession(documentId) {
        if (
            typeof documentId !== "string" ||
            documentId.trim() === ""
        ) {
            return null;
        }

        return (
            this.documentSessions.get(
                documentId
            ) || null
        );
    }

    getActiveDocumentSession() {
        if (!this.activeDocument) {
            return null;
        }

        return this.getDocumentSession(
            this.activeDocument.id
        );
    }

    hasDocumentSession(documentId) {
        if (
            typeof documentId !== "string" ||
            documentId.trim() === ""
        ) {
            return false;
        }

        return this.documentSessions.has(
            documentId
        );
    }

    getDocumentSessions() {
        return new Map(
            this.documentSessions
        );
    }

    clear() {
        this.destroyAllDocumentSessions();

        this.documents = [];
        this.activeDocument = null;

        this.notifyChange();

        return this;
    }

    destroy() {
        return this.clear();
    }

    createDocumentSessions(documents) {
        for (
            const document
            of documents
        ) {
            this.createDocumentSession(
                document
            );
        }

        return this;
    }

    createDocumentSession(document) {
        this.validateDocument(
            document
        );

        const existingSession =
            this.documentSessions.get(
                document.id
            );

        if (existingSession) {
            return existingSession;
        }

        const session =
            new DocumentSession(
                document,
                {
                    onChange:
                        event => {
                            this.handleDocumentSessionChange(
                                event
                            );
                        }
                }
            );

        this.documentSessions.set(
            document.id,
            session
        );

        this.eventBus.emit(
            WorkspaceEvents
                .DOCUMENT_SESSION_CREATED,
            Object.freeze({
                documentId:
                    document.id,

                sessionState:
                    session.getStateSnapshot()
            })
        );

        return session;
    }

    destroyDocumentSession(documentId) {
        const session =
            this.documentSessions.get(
                documentId
            );

        if (!session) {
            return this;
        }

        session.destroy();

        const sessionState =
            session.getStateSnapshot();

        this.documentSessions.delete(
            documentId
        );

        this.eventBus.emit(
            WorkspaceEvents
                .DOCUMENT_SESSION_DESTROYED,
            Object.freeze({
                documentId,
                sessionState
            })
        );

        return this;
    }

    destroyAllDocumentSessions() {
        const documentIds = [
            ...this.documentSessions.keys()
        ];

        for (
            const documentId
            of documentIds
        ) {
            this.destroyDocumentSession(
                documentId
            );
        }

        return this;
    }

    handleDocumentSessionChange(event) {
        this.eventBus.emit(
            WorkspaceEvents
                .DOCUMENT_SESSION_CHANGED,
            event
        );

        if (
            event.change.type ===
            "active-page"
        ) {
            this.eventBus.emit(
                WorkspaceEvents
                    .ACTIVE_PAGE_CHANGED,
                event
            );
        }

        return this;
    }

    validateDocuments(
        documents,
        methodName
    ) {
        if (!Array.isArray(documents)) {
            throw new TypeError(
                `${methodName} expects an array.`
            );
        }

        const documentIds =
            new Set();

        for (
            const document
            of documents
        ) {
            this.validateDocument(
                document
            );

            if (
                documentIds.has(
                    document.id
                )
            ) {
                throw new Error(
                    `Duplicate workspace document ID: ${document.id}`
                );
            }

            documentIds.add(
                document.id
            );
        }
    }

    validateDocument(document) {
        if (
            !document ||
            typeof document !== "object"
        ) {
            throw new TypeError(
                "WorkspaceStore requires valid document objects."
            );
        }

        if (
            typeof document.id !== "string" ||
            document.id.trim() === ""
        ) {
            throw new TypeError(
                "Workspace document must have a valid ID."
            );
        }
    }

    notifyChange() {
        this.eventBus.emit(
            WorkspaceEvents.STORE_CHANGED
        );
    }
}