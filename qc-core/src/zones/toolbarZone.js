import {
    WorkspaceEvents
} from "../workspace/workspaceEvents.js";

import {
    WorkspaceState
} from "../workspace/workspaceState.js";

const DEFAULT_TOOLBAR_CONFIG = Object.freeze({
    title: "PDF Workspace",
    subtitle: "Prepare and process your PDF document.",
    badge: "PDF Tool"
});

const STATUS_PRESENTATION = Object.freeze({
    [WorkspaceState.EMPTY]: Object.freeze({
        label: "Waiting for file",
        tone: "idle"
    }),
    [WorkspaceState.READY]: Object.freeze({
        label: "Ready",
        tone: "ready"
    }),
    [WorkspaceState.PROCESSING]: Object.freeze({
        label: "Processing",
        tone: "processing"
    }),
    [WorkspaceState.SUCCESS]: Object.freeze({
        label: "Completed",
        tone: "success"
    }),
    [WorkspaceState.ERROR]: Object.freeze({
        label: "Error",
        tone: "error"
    })
});

export class ToolbarZone {

    constructor(
        engine,
        config = {}
    ) {

        if (
            !engine ||
            typeof engine !== "object"
        ) {
            throw new TypeError(
                "ToolbarZone requires a valid WorkspaceEngine."
            );
        }

        if (
            !config ||
            typeof config !== "object" ||
            Array.isArray(config)
        ) {
            throw new TypeError(
                "ToolbarZone configuration must be an object."
            );
        }

        this.engine =
            engine;

        this.config =
            this.normalizeConfig(config);

        this.zoneElement =
            null;

        this.statusElement =
            null;

        this.actionsElement =
            null;

        this.initialized =
            false;

        this.handleStateChanged =
            this.handleStateChanged.bind(this);

        this.handleReset =
            this.handleReset.bind(this);

    }

    initialize() {

        if (this.initialized) {
            return this;
        }

        this.zoneElement =
            this.engine
                .getLayout()
                .getZone("toolbar");

        if (!this.zoneElement) {
            throw new Error(
                "ToolbarZone could not find its layout element."
            );
        }

        this.render();
        this.subscribe();
        this.updateStatus(
            this.engine.getState()
        );

        this.initialized =
            true;

        return this;

    }

    normalizeConfig(config) {

        return Object.freeze({
            tool: this.normalizeText(
                config.tool,
                ""
            ),
            title: this.normalizeText(
                config.title,
                this.createToolTitle(config.tool)
            ),
            subtitle: this.normalizeText(
                config.subtitle,
                DEFAULT_TOOLBAR_CONFIG.subtitle
            ),
            badge: this.normalizeText(
                config.badge,
                DEFAULT_TOOLBAR_CONFIG.badge
            )
        });

    }

    normalizeText(
        value,
        fallback
    ) {

        if (
            typeof value !== "string"
        ) {
            return fallback;
        }

        const normalized =
            value.trim();

        return normalized || fallback;

    }

    createToolTitle(tool) {

        if (
            typeof tool !== "string" ||
            tool.trim() === ""
        ) {
            return DEFAULT_TOOLBAR_CONFIG.title;
        }

        const words =
            tool
                .trim()
                .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                .replace(/[-_]+/g, " ")
                .split(/\s+/)
                .filter(Boolean)
                .map(word => (
                    word.charAt(0).toUpperCase() +
                    word.slice(1).toLowerCase()
                ));

        return `${words.join(" ")} PDF`;

    }

    render() {

        this.zoneElement.replaceChildren();

        const toolbar =
            document.createElement("header");

        toolbar.className =
            "qc-toolbar";

        toolbar.setAttribute(
            "data-qc-role",
            "workspace-toolbar"
        );

        const identity =
            document.createElement("div");

        identity.className =
            "qc-toolbar__identity";

        const badge =
            document.createElement("span");

        badge.className =
            "qc-toolbar__badge";

        badge.textContent =
            this.config.badge;

        const headingGroup =
            document.createElement("div");

        headingGroup.className =
            "qc-toolbar__heading-group";

        const title =
            document.createElement("h2");

        title.className =
            "qc-toolbar__title";

        title.textContent =
            this.config.title;

        const subtitle =
            document.createElement("p");

        subtitle.className =
            "qc-toolbar__subtitle";

        subtitle.textContent =
            this.config.subtitle;

        headingGroup.append(
            title,
            subtitle
        );

        identity.append(
            badge,
            headingGroup
        );

        const controls =
            document.createElement("div");

        controls.className =
            "qc-toolbar__controls";

        this.actionsElement =
            document.createElement("div");

        this.actionsElement.className =
            "qc-toolbar__actions";

        this.actionsElement.setAttribute(
            "data-qc-role",
            "toolbar-actions"
        );

        this.actionsElement.setAttribute(
            "aria-label",
            "Workspace actions"
        );

        this.statusElement =
            document.createElement("span");

        this.statusElement.className =
            "qc-toolbar__status";

        this.statusElement.setAttribute(
            "data-qc-role",
            "toolbar-status"
        );

        this.statusElement.setAttribute(
            "role",
            "status"
        );

        this.statusElement.setAttribute(
            "aria-live",
            "polite"
        );

        controls.append(
            this.actionsElement,
            this.statusElement
        );

        toolbar.append(
            identity,
            controls
        );

        this.zoneElement.appendChild(
            toolbar
        );

        return this;

    }

    subscribe() {

        this.engine.on(
            WorkspaceEvents.STATE_CHANGED,
            this.handleStateChanged
        );

        this.engine.on(
            WorkspaceEvents.RESET,
            this.handleReset
        );

        return this;

    }

    unsubscribe() {

        this.engine.off(
            WorkspaceEvents.STATE_CHANGED,
            this.handleStateChanged
        );

        this.engine.off(
            WorkspaceEvents.RESET,
            this.handleReset
        );

        return this;

    }

    handleStateChanged(payload) {

        this.updateStatus(
            payload?.currentState
        );

    }

    handleReset(payload) {

        this.updateStatus(
            payload?.state ??
            WorkspaceState.EMPTY
        );

    }

    updateStatus(state) {

        if (!this.statusElement) {
            return this;
        }

        const presentation =
            STATUS_PRESENTATION[state] ??
            STATUS_PRESENTATION[WorkspaceState.EMPTY];

        this.statusElement.className =
            `qc-toolbar__status qc-toolbar__status--${presentation.tone}`;

        this.statusElement.textContent =
            presentation.label;

        this.statusElement.setAttribute(
            "data-qc-state",
            state ?? WorkspaceState.EMPTY
        );

        this.statusElement.setAttribute(
            "aria-busy",
            state === WorkspaceState.PROCESSING
                ? "true"
                : "false"
        );

        return this;

    }

    getElement() {

        return this.zoneElement;

    }

    getActionsElement() {

        return this.actionsElement;

    }

    getStatusElement() {

        return this.statusElement;

    }

    getConfig() {

        return {
            ...this.config
        };

    }

    isInitialized() {

        return this.initialized;

    }

    destroy() {

        if (!this.initialized) {
            return this;
        }

        this.unsubscribe();

        if (this.zoneElement) {
            this.zoneElement.replaceChildren();
        }

        this.statusElement =
            null;

        this.actionsElement =
            null;

        this.zoneElement =
            null;

        this.initialized =
            false;

        return this;

    }

}
