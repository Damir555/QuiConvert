import {
    WorkspaceEngine
} from "./workspaceEngine.js";

import {
    WorkspaceProcessor
} from "./workspaceProcessor.js";

import {
    getToolDefinition
} from "../../config/toolDefinitions.js";

import {
    ToolbarZone
} from "../zones/toolbarZone.js";

import {
    UploadZone
} from "../zones/uploadZone.js";

import {
    FilesZone
} from "../zones/filesZone.js";

import {
    ThumbnailZone
} from "../zones/thumbnailZone.js";

import {
    PreviewZone
} from "../UI/zones/previewZone.js";

import {
    ToolZone
} from "../zones/toolZone.js";

import {
    ActionZone
} from "../zones/actionZone.js";

import {
    ResultZone
} from "../zones/resultZone.js";

function resolveWorkspaceConfig(config = {}) {

    if (
        config === null ||
        typeof config !== "object" ||
        Array.isArray(config)
    ) {
        throw new TypeError(
            "WorkspaceApplication config must be a plain object."
        );
    }

    const toolDefinition =
        resolveConfiguredToolDefinition(
            config
        );

    const explicitCapabilities =
        config.capabilities ??
        config.capability;

    const capabilities =
        explicitCapabilities ??
        toolDefinition?.capabilities ??
        {};

    return {
        ...config,
        ...(toolDefinition
            ? {
                toolDefinition
            }
            : {}),
        capabilities
    };

}

function resolveConfiguredToolDefinition(config) {

    if (
        config.toolDefinition !== undefined
    ) {
        if (
            !config.toolDefinition ||
            typeof config.toolDefinition !==
                "object" ||
            Array.isArray(
                config.toolDefinition
            )
        ) {
            throw new TypeError(
                "WorkspaceApplication config.toolDefinition must be an object."
            );
        }

        return config.toolDefinition;
    }

    if (
        typeof config.tool !== "string" ||
        config.tool.trim() === ""
    ) {
        return null;
    }

    return getToolDefinition(
        config.tool.trim()
    );

}

export class WorkspaceApplication {

    constructor(config = {}) {

        this.config =
            resolveWorkspaceConfig(
                config
            );

        this.engine =
            new WorkspaceEngine(
                this.config
            );

        this.processor =
            new WorkspaceProcessor(
                this.engine
            );

        this.zones =
            new Map();

        this.initialized =
            false;

        this.mounted =
            false;

        this.destroyed =
            false;

        this.handleProcessRequest =
            this.handleProcessRequest.bind(this);

    }

    initialize() {

        this.assertNotDestroyed();

        if (this.initialized) {
            return this;
        }

        this.engine.initialize();

        this.initialized =
            true;

        return this;

    }

    mount(rootElement) {

        this.assertNotDestroyed();

        if (!this.initialized) {
            throw new Error(
                "WorkspaceApplication must be initialized before mounting."
            );
        }

        if (
            !(rootElement instanceof HTMLElement)
        ) {
            throw new TypeError(
                "WorkspaceApplication requires a valid root HTML element."
            );
        }

        if (this.mounted) {
            throw new Error(
                "WorkspaceApplication is already mounted."
            );
        }

        this.engine.mount(
            rootElement
        );

        try {

            this.createZones();
            this.initializeZones();
            this.applyLayoutCapabilities();

        } catch (error) {

            this.destroyZones();

            const layout =
                this.engine.getLayout();

            if (
                layout &&
                typeof layout.destroy ===
                    "function"
            ) {
                layout.destroy();
            }

            throw error;

        }

        this.mounted =
            true;

        return this;

    }

    createZones() {

        if (this.zones.size > 0) {
            throw new Error(
                "Workspace zones have already been created."
            );
        }

        this.registerZone(
            "toolbar",
            new ToolbarZone(
                this.engine,
                this.getToolbarConfig()
            )
        );

        this.registerZone(
            "upload",
            new UploadZone(
                this.engine
            )
        );

        this.registerZone(
            "files",
            new FilesZone(
                this.engine
            )
        );

        this.registerZone(
            "thumbnail",
            new ThumbnailZone(
                this.engine
            )
        );

        this.registerZone(
            "preview",
            new PreviewZone(
                this.engine
            )
        );

        this.registerZone(
            "tool",
            new ToolZone(
                this.engine,
                this.getConfiguredTool()
            )
        );

        this.registerZone(
            "action",
            new ActionZone(
                this.engine,
                this.handleProcessRequest
            )
        );

        this.registerZone(
            "result",
            new ResultZone(
                this.engine
            )
        );

        return this;

    }

    registerZone(
        zoneName,
        zone
    ) {

        if (
            typeof zoneName !== "string" ||
            zoneName.trim() === ""
        ) {
            throw new TypeError(
                "Workspace zone requires a valid name."
            );
        }

        if (
            !zone ||
            typeof zone !== "object"
        ) {
            throw new TypeError(
                `Workspace zone "${zoneName}" requires a valid instance.`
            );
        }

        if (this.zones.has(zoneName)) {
            throw new Error(
                `Workspace zone is already registered: ${zoneName}`
            );
        }

        this.zones.set(
            zoneName,
            zone
        );

        return zone;

    }

    initializeZones() {

        const initializedZones =
            [];

        try {

            for (
                const zone of this.zones.values()
            ) {

                if (
                    typeof zone.initialize !==
                        "function"
                ) {
                    throw new Error(
                        "Workspace zone does not provide initialize()."
                    );
                }

                zone.initialize();

                initializedZones.push(
                    zone
                );

            }

        } catch (error) {

            for (
                const zone of initializedZones.reverse()
            ) {

                if (
                    typeof zone.destroy ===
                        "function"
                ) {
                    zone.destroy();
                }

            }

            throw error;

        }

        return this;

    }

    applyLayoutCapabilities() {

        const layout =
            this.engine.getLayout();

        if (
            !layout ||
            typeof layout.applyCapabilities !==
                "function"
        ) {
            throw new Error(
                "WorkspaceLayout does not provide applyCapabilities()."
            );
        }

        layout.applyCapabilities(
            this.engine.getCapabilities()
        );

        return this;

    }

    async handleProcessRequest() {

        const toolZone =
            this.getZone("tool");

        const actionZone =
            this.getZone("action");

        const resultZone =
            this.getZone("result");

        if (!toolZone) {
            throw new Error(
                "Workspace ToolZone is not available."
            );
        }

        if (!resultZone) {
            throw new Error(
                "Workspace ResultZone is not available."
            );
        }

        const options =
            toolZone.getOptions();

        const processButton =
            actionZone?.getButton?.();

        if (processButton) {
            processButton.disabled =
                true;
        }

        resultZone.showProcessing();

        try {

            const result =
                await this.process(
                    options
                );

            if (
                !result ||
                !(result.blob instanceof Blob)
            ) {
                throw new Error(
                    "Processing completed without a valid result file."
                );
            }

            resultZone.showResult(
                result.blob,
                result.filename
            );

            return result;

        } catch (error) {

            console.error(
                "[WorkspaceApplication] Processing failed:",
                error
            );

            resultZone.showError(
                error?.message ||
                "Processing failed."
            );

            return null;

        } finally {

            if (processButton) {
                processButton.disabled =
                    false;
            }

        }

    }

    getToolbarConfig() {

        const toolbar =
            this.config?.toolbar;

        if (
            toolbar !== undefined &&
            (
                !toolbar ||
                typeof toolbar !== "object" ||
                Array.isArray(toolbar)
            )
        ) {
            throw new TypeError(
                "WorkspaceApplication config.toolbar must be an object."
            );
        }

        return {
            tool: this.getConfiguredTool(),
            ...(toolbar || {})
        };

    }

    getConfiguredTool() {

        const tool =
            this.config?.tool;

        if (
            typeof tool !== "string" ||
            tool.trim() === ""
        ) {
            throw new Error(
                "WorkspaceApplication requires config.tool."
            );
        }

        return tool.trim();

    }

    getEngine() {

        return this.engine;

    }

    getProcessor() {

        return this.processor;

    }

    process(options = {}) {

        this.assertNotDestroyed();

        if (!this.initialized) {
            throw new Error(
                "WorkspaceApplication must be initialized before processing."
            );
        }

        return this.processor.process({
            ...this.config,
            options
        });

    }

    getZone(zoneName) {

        if (
            typeof zoneName !== "string" ||
            zoneName.trim() === ""
        ) {
            return null;
        }

        return this.zones.get(
            zoneName
        ) ?? null;

    }

    hasZone(zoneName) {

        if (
            typeof zoneName !== "string" ||
            zoneName.trim() === ""
        ) {
            return false;
        }

        return this.zones.has(
            zoneName
        );

    }

    getZones() {

        return new Map(
            this.zones
        );

    }

    isInitialized() {

        return this.initialized;

    }

    isMounted() {

        return this.mounted;

    }

    isDestroyed() {

        return this.destroyed;

    }

    destroyZones() {

        const zones =
            Array.from(
                this.zones.values()
            ).reverse();

        for (const zone of zones) {

            if (
                typeof zone.destroy !==
                    "function"
            ) {
                continue;
            }

            try {

                zone.destroy();

            } catch (error) {

                console.error(
                    "[WorkspaceApplication] Failed to destroy zone:",
                    error
                );

            }

        }

        this.zones.clear();

        return this;

    }

    destroy() {

        if (this.destroyed) {
            return this;
        }

        this.destroyZones();

        const layout =
            this.engine?.getLayout?.();

        if (
            layout &&
            typeof layout.destroy ===
                "function"
        ) {
            layout.destroy();
        }

        if (
            this.engine &&
            typeof this.engine.destroy ===
                "function"
        ) {
            this.engine.destroy();
        }

        this.config =
            {};

        this.processor =
            null;

        this.initialized =
            false;

        this.mounted =
            false;

        this.destroyed =
            true;

        return this;

    }

    assertNotDestroyed() {

        if (this.destroyed) {
            throw new Error(
                "WorkspaceApplication has been destroyed."
            );
        }

    }

}
