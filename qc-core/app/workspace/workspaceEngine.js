export class WorkspaceEngine {

    constructor(config = {}) {

        this.config = config;

        this.state = "EMPTY";

        this.capability = null;

    }

    initialize() {

    }

    loadCapability(capability) {

        this.capability = capability;

    }

    setState(state) {

        this.state = state;

    }

    getState() {

        return this.state;

    }

    reset() {

    }

    destroy() {

    }

}