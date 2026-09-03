const ZONE_NAMES = Object.freeze([
    "toolbar",
    "upload",
    "files",
    "thumbnail",
    "preview",
    "tool",
    "action",
    "status",
    "result"
]);

const ZONE_CAPABILITIES = Object.freeze({
    thumbnail: "thumbnails",
    preview: "preview",
    tool: "toolOptions",
    action: "processing"
});

export class WorkspaceLayout {

    constructor() {

        this.rootElement =
            null;

        this.workspaceElement =
            null;

        this.viewerElement =
            null;

        this.zones =
            new Map();

    }

    mount(rootElement) {

        if (
            !(rootElement instanceof HTMLElement)
        ) {
            throw new TypeError(
                "WorkspaceLayout requires a valid root HTML element."
            );
        }

        this.destroy();

        this.rootElement =
            rootElement;

        this.workspaceElement =
            this.createWorkspaceElement();

        this.rootElement.appendChild(
            this.workspaceElement
        );

        return this;

    }

    createWorkspaceElement() {

        const workspace =
            document.createElement("div");

        workspace.className =
            "qc-workspace";

        workspace.setAttribute(
            "data-qc-workspace",
            ""
        );

        const toolbarZone =
            this.createZone(
                "toolbar"
            );

        const documentSection =
            this.createDocumentSection();

        const configurationSection =
            this.createSection(
                "configuration",
                [
                    "tool",
                    "action"
                ]
            );

        const processingSection =
            this.createSection(
                "processing",
                [
                    "status",
                    "result"
                ]
            );

        workspace.append(
            toolbarZone,
            documentSection,
            configurationSection,
            processingSection
        );

        return workspace;

    }

    createDocumentSection() {

        const section =
            this.createSectionElement(
                "document"
            );

        const uploadZone =
            this.createZone(
                "upload"
            );

        const filesZone =
            this.createZone(
                "files"
            );

        const viewer =
            this.createViewerElement();

        const thumbnailZone =
            this.createZone(
                "thumbnail"
            );

        const previewZone =
            this.createZone(
                "preview"
            );

        viewer.append(
            thumbnailZone,
            previewZone
        );

        section.append(
            uploadZone,
            filesZone,
            viewer
        );

        return section;

    }

    createSection(
        sectionName,
        zoneNames
    ) {

        this.validateZoneNames(
            zoneNames
        );

        const section =
            this.createSectionElement(
                sectionName
            );

        for (
            const zoneName of zoneNames
        ) {
            section.appendChild(
                this.createZone(
                    zoneName
                )
            );
        }

        return section;

    }

    createSectionElement(
        sectionName
    ) {

        if (
            typeof sectionName !== "string" ||
            sectionName.trim() === ""
        ) {
            throw new TypeError(
                "Workspace section requires a valid name."
            );
        }

        const normalizedName =
            sectionName.trim();

        const section =
            document.createElement(
                "section"
            );

        section.className =
            `qc-workspace__section qc-workspace__section--${normalizedName}`;

        section.setAttribute(
            "data-qc-section",
            normalizedName
        );

        return section;

    }

    createViewerElement() {

        const viewer =
            document.createElement("div");

        viewer.className =
            "qc-workspace__viewer";

        viewer.setAttribute(
            "data-qc-viewer",
            ""
        );

        this.viewerElement =
            viewer;

        return viewer;

    }

    createZone(zoneName) {

        this.validateZoneName(
            zoneName
        );

        if (
            this.zones.has(zoneName)
        ) {
            throw new Error(
                `Workspace zone already exists: ${zoneName}`
            );
        }

        const zone =
            document.createElement("div");

        zone.className =
            `qc-workspace__zone qc-workspace__zone--${zoneName}`;

        zone.setAttribute(
            "data-qc-zone",
            zoneName
        );

        this.zones.set(
            zoneName,
            zone
        );

        return zone;

    }

    validateZoneName(zoneName) {

        if (
            typeof zoneName !== "string" ||
            zoneName.trim() === ""
        ) {
            throw new TypeError(
                "Workspace zone requires a valid name."
            );
        }

        if (
            !ZONE_NAMES.includes(zoneName)
        ) {
            throw new Error(
                `Unknown workspace zone: ${zoneName}`
            );
        }

    }

    validateZoneNames(zoneNames) {

        if (!Array.isArray(zoneNames)) {
            throw new TypeError(
                "Workspace section zone names must be an array."
            );
        }

        for (
            const zoneName of zoneNames
        ) {
            this.validateZoneName(
                zoneName
            );
        }

    }

    applyCapabilities(capabilities) {

        if (
            !capabilities ||
            typeof capabilities !== "object" ||
            Array.isArray(capabilities)
        ) {
            throw new TypeError(
                "Workspace capabilities must be an object."
            );
        }

        for (
            const [
                zoneName,
                capabilityName
            ] of Object.entries(
                ZONE_CAPABILITIES
            )
        ) {

            const visible =
                capabilities[capabilityName];

            if (typeof visible !== "boolean") {
                throw new TypeError(
                    `Workspace capability "${capabilityName}" must be boolean.`
                );
            }

            this.setZoneVisible(
                zoneName,
                visible
            );

        }

        this.refreshViewer();

        return this;

    }

    setZoneVisible(
        zoneName,
        visible
    ) {

        this.validateZoneName(
            zoneName
        );

        if (typeof visible !== "boolean") {
            throw new TypeError(
                "Workspace zone visibility must be boolean."
            );
        }

        const zone =
            this.getZone(
                zoneName
            );

        if (!zone) {
            throw new Error(
                `Workspace zone is not available: ${zoneName}`
            );
        }

        zone.hidden =
            !visible;

        return this;

    }

    isZoneVisible(zoneName) {

        this.validateZoneName(
            zoneName
        );

        const zone =
            this.getZone(
                zoneName
            );

        if (!zone) {
            return false;
        }

        return !zone.hidden;

    }

    refreshViewer() {

        if (!this.viewerElement) {
            return this;
        }

        const thumbnailVisible =
            this.isZoneVisible(
                "thumbnail"
            );

        const previewVisible =
            this.isZoneVisible(
                "preview"
            );

        this.viewerElement.hidden =
            !(
                thumbnailVisible ||
                previewVisible
            );

        return this;

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

    getViewerElement() {

        return this.viewerElement;

    }

    getElement() {

        return this.workspaceElement;

    }

    isMounted() {

        return Boolean(
            this.rootElement &&
            this.workspaceElement
        );

    }

    destroy() {

        if (this.workspaceElement) {
            this.workspaceElement.remove();
        }

        this.zones.clear();

        this.viewerElement =
            null;

        this.workspaceElement =
            null;

        this.rootElement =
            null;

        return this;

    }

}