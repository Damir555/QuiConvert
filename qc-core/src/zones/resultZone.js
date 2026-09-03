import {
    WorkspaceZone
} from "./workspaceZone.js";

import {
    showStatus,
    showDownload
} from "../../ui/resultView.js";

import {
    showError
} from "../../ui/errorView.js";

export class ResultZone extends WorkspaceZone {

    constructor(workspace) {

        super(
            workspace,
            "result"
        );

        this.contentElement =
            null;

    }

    render() {

        super.render();

        const element =
            this.getElement();

        element.replaceChildren();

        element.dataset.qcRole =
            "workspace-result-zone";

        const title =
            document.createElement("h2");

        title.textContent =
            "Result";

        this.contentElement =
            document.createElement("div");

        this.contentElement.className =
            "qc-result-container";

        this.contentElement.dataset.qcRole =
            "workspace-result";

        this.contentElement.setAttribute(
            "aria-live",
            "polite"
        );

        this.contentElement.setAttribute(
            "aria-atomic",
            "true"
        );

        element.append(
            title,
            this.contentElement
        );

        this.showIdle();

        return this;

    }

    showIdle() {

        showStatus(
            this.contentElement,
            "Processed files will appear here."
        );

        return this;

    }

    showProcessing() {

        showStatus(
            this.contentElement,
            "Processing..."
        );

        return this;

    }

    showResult(
        blob,
        filename
    ) {

        if (!(blob instanceof Blob)) {
            throw new TypeError(
                "ResultZone requires a valid result Blob."
            );
        }

        showDownload(
            this.contentElement,
            blob,
            filename
        );

        return this;

    }

    showError(message) {

        const resolvedMessage =
            typeof message === "string" &&
            message.trim() !== ""
                ? message.trim()
                : "Processing failed.";

        showError(
            this.contentElement,
            resolvedMessage
        );

        return this;

    }

    destroy() {

        if (this.isDestroyed()) {
            return this;
        }

        super.destroy();

        this.contentElement =
            null;

        return this;

    }

}
