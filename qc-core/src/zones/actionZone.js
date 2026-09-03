import {
    WorkspaceZone
} from "./workspaceZone.js";

export class ActionZone extends WorkspaceZone {

     constructor(workspace,onProcess = null) {

        super(
            workspace,
            "action"
        );

        this.processButton =
            null;

        this.onProcess =
            typeof onProcess === "function"
                ? onProcess
                : null;

        this.handleProcessClick =
            this.handleProcessClick.bind(this);

    }

    render() {

        super.render();

        const element =
            this.getElement();

        element.replaceChildren();

        element.dataset.qcRole =
            "workspace-action-zone";

        const title =
            document.createElement("h2");

        title.textContent =
            "Processing";

        this.processButton =
            document.createElement("button");

        this.processButton.type =
            "button";

        this.processButton.textContent =
            "Process PDF";

        this.processButton.dataset.qcRole =
            "process-button";

        element.append(
            title,
            this.processButton
        );

        return this;

    }

    bindEvents() {

        this.processButton?.addEventListener(
            "click",
            this.handleProcessClick
        );

        return this;

    }

    unbindEvents() {

        this.processButton?.removeEventListener(
            "click",
            this.handleProcessClick
        );

        return this;

    }

    handleProcessClick() {

        if (this.onProcess) {
            this.onProcess();
        }

}

    getButton() {

        return this.processButton;

    }

    destroy() {

        if (this.isDestroyed()) {
            return this;
        }

        this.unbindEvents();

        super.destroy();

        this.onProcess = null;

        this.processButton =
            null;

        return this;

    }

}