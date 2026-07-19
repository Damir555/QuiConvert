export class UploadZone {

    constructor(workspace) {
        this.workspace = workspace;
        this.element = null;
    }

    attach(element) {
        if (!(element instanceof HTMLElement)) {
            throw new TypeError("UploadZone requires a valid HTML element.");
        }

        this.element = element;

        return this;
    }

    show() {
        if (this.element) {
            this.element.hidden = false;
        }

        return this;
    }

    hide() {
        if (this.element) {
            this.element.hidden = true;
        }

        return this;
    }

    enable() {
        if (this.element) {
            this.element.removeAttribute("aria-disabled");
        }

        return this;
    }

    disable() {
        if (this.element) {
            this.element.setAttribute("aria-disabled", "true");
        }

        return this;
    }

    destroy() {
        this.element = null;
    }
}