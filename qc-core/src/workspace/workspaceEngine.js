import {
    WorkspaceState,
    canTransitionWorkspaceState,
    isWorkspaceState
} from "./workspaceState.js";

import {
    EventBus
} from "./eventBus.js";

import {
    WorkspaceEvents
} from "./workspaceEvents.js";

import {
    WorkspaceLayout
} from "./workspaceLayout.js";

import {
    SelectionManager
} from "./selectionManager.js";

import {
    WorkspaceStore
} from "../domain/workspaceStore.js";

import {
    resolveToolCapabilities
} from "../shared/toolCapabilities.js";

export class WorkspaceEngine {

    constructor(config = {}) {
        this.config = config;

        this.state = null;
        this.capabilities = null;

        this.eventBus =
            new EventBus();

        this.store =
            new WorkspaceStore(
                this.eventBus
            );

        this.selectionManager =
            new SelectionManager(
                this.eventBus
            );

        this.layout =
            new WorkspaceLayout();
    }

    initialize() {
        this.state =
            WorkspaceState.EMPTY;

        this.loadCapability(
            this.getConfiguredCapabilities()
        );

        return this;
    }

    getConfiguredCapabilities() {
        const configuredCapabilities =
            this.config?.capabilities ??
            this.config?.capability ??
            {};

        return configuredCapabilities;
    }

    on(event, callback) {
        this.eventBus.on(
            event,
            callback
        );

        return this;
    }

    off(event, callback) {
        this.eventBus.off(
            event,
            callback
        );

        return this;
    }

    emit(event, payload) {
        this.eventBus.emit(
            event,
            payload
        );

        return this;
    }

    mount(rootElement) {
        this.layout.mount(
            rootElement
        );

        return this;
    }

    loadCapability(capability = {}) {
        this.capabilities =
            resolveToolCapabilities(
                capability
            );

        return this;
    }

    getCapabilities() {
        if (!this.capabilities) {
            throw new Error(
                "Workspace must be initialized before reading capabilities."
            );
        }

        return this.capabilities;
    }

    setState(nextState) {
        if (!isWorkspaceState(nextState)) {
            throw new Error(
                `Unknown workspace state: ${String(nextState)}`
            );
        }

        if (this.state === null) {
            throw new Error(
                "Workspace must be initialized before changing state."
            );
        }

        if (
            !canTransitionWorkspaceState(
                this.state,
                nextState
            )
        ) {
            throw new Error(
                `Invalid workspace state transition: ${this.state} -> ${nextState}`
            );
        }

        const previousState =
            this.state;

        this.state =
            nextState;

        this.emit(
            WorkspaceEvents.STATE_CHANGED,
            {
                previousState,
                currentState: nextState
            }
        );

        return this.state;
    }

    getLayout() {
        return this.layout;
    }

    getStore() {
        return this.store;
    }

    getSelectionManager() {
        return this.selectionManager;
    }

    getState() {
        return this.state;
    }

    reset() {
        if (this.state === null) {
            return this;
        }

        this.selectionManager.clear();
        this.store.clear();

        if (
            this.state !==
            WorkspaceState.EMPTY
        ) {
            this.setState(
                WorkspaceState.EMPTY
            );
        }

        this.emit(
            WorkspaceEvents.RESET,
            {
                state: this.state
            }
        );

        return this;
    }

    destroy() {
        this.selectionManager.clear();
        this.store.clear();

        this.capabilities = null;
        this.state = null;
        this.config = {};

        return this;
    }
}
