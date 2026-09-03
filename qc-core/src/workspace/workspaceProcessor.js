import {
    dispatchTool
} from "../../engine/dispatcher.js";

export class WorkspaceProcessor {

    constructor(engine) {

        if (
            !engine ||
            typeof engine !== "object"
        ) {
            throw new TypeError(
                "WorkspaceProcessor requires a valid WorkspaceEngine."
            );
        }

        this.engine = engine;

    }

    getEngine() {

        return this.engine;

    }

    getStore() {

        return this.engine.getStore();

    }

    getActiveSession() {

        const store =
            this.getStore();

        return store.getActiveDocumentSession();

    }

    hasActiveSession() {

        return (
            this.getActiveSession() !== null
        );

    }

    buildToolOptions(options = {}) {

        const session =
            this.getActiveSession();

        if (!session) {
            throw new Error(
                "No active DocumentSession."
            );
        }

        const documents =
            this.getStore().getDocuments();

        const files =
            documents
                .map(document => document?.file)
                .filter(file => file instanceof File);

        return Object.freeze({

            ...options,

            documents,

            files,

            document:
                session.getDocument(),

            documentId:
                session.getDocumentId(),

            pageOrder:
                session.getPageOrder(),

            activePage:
                session.getActivePage(),

            pageCount:
                session.getPageCount(),

            revision:
                session.getRevision(),

            dirty:
                session.isDirty()

        });

    }

    process(config = {}) {

        if (
            !config ||
            typeof config !== "object"
        ) {
            throw new TypeError(
                "WorkspaceProcessor requires a valid configuration."
            );
        }

        if (
            typeof config.tool !== "string" ||
            config.tool.trim() === ""
        ) {
            throw new Error(
                "WorkspaceProcessor requires a tool name."
            );
        }

        const toolOptions =
            this.buildToolOptions(
                config.options || {}
            );

        return dispatchTool(
            config,
            toolOptions
        );

    }

}