export class WorkspaceEngine {

    constructor(config = {}) {

        this.config = config;

        this.state = null;

        this.capability = null;

    }

    initialize() {

        this.state = "EMPTY";

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

        this.state = "EMPTY";

    }

    destroy() {

        this.capability = null;

        this.state = null;

    }

}