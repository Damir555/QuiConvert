import {
    WorkspaceState,
    canTransitionWorkspaceState,
    isWorkspaceState
} from "./workspaceState.js";

export class WorkspaceEngine {

    constructor(config = {}) {
        this.config = config;
        this.state = null;
        this.capability = null;
    }

    initialize() {
        this.state = WorkspaceState.EMPTY;

        return this;
    }

    loadCapability(capability) {
        if (!capability || typeof capability !== "object") {
            throw new TypeError(
                "Workspace capability must be a valid object."
            );
        }

        this.capability = capability;

        return this;
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

        if (!canTransitionWorkspaceState(this.state, nextState)) {
            throw new Error(
                `Invalid workspace state transition: ${this.state} -> ${nextState}`
            );
        }

        this.state = nextState;

        return this.state;
    }

    getState() {
        return this.state;
    }

    reset() {
        if (this.state === null) {
            return this;
        }

        if (this.state !== WorkspaceState.EMPTY) {
            this.setState(WorkspaceState.EMPTY);
        }

        return this;
    }

    destroy() {
        this.capability = null;
        this.state = null;
        this.config = {};

        return this;
    }
}