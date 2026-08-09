import { WorkspaceZone } from "./workspaceZone.js";

export class DummyZone extends WorkspaceZone {

    constructor(workspace) {

        super(
            workspace,
            "dummy"
        );

    }

    render() {

        super.render();

        this.getElement().innerHTML = `
            <h2>Dummy Zone</h2>
            <p>
                WorkspaceZone inheritance works.
            </p>
        `;

        return this;

    }

}