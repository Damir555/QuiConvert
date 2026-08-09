import { createSiteHeader } from "../components/siteHeader.js";
import { createBreadcrumb } from "../components/breadcrumb.js";
import { createToolHero } from "../components/toolHero.js";
import { createRelatedTools } from "../components/relatedTools.js";
import { createFaqSection } from "../components/faqSection.js";
import { createTrustSection } from "../components/trustSection.js";
import { createSiteFooter } from "../components/siteFooter.js";

function assertSchema(schema) {
    if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
        throw new TypeError("WorkspaceTemplate requires a schema object.");
    }
    if (typeof schema.id !== "string" || schema.id.trim() === "") {
        throw new TypeError("Workspace schema requires a non-empty id.");
    }
    if (!schema.workspace || typeof schema.workspace !== "object") {
        throw new TypeError("Workspace schema requires workspace configuration.");
    }
}

export class WorkspaceTemplate {
    constructor(rootElement, schema) {
        if (!(rootElement instanceof HTMLElement)) {
            throw new TypeError("WorkspaceTemplate requires a valid root element.");
        }
        assertSchema(schema);
        this.rootElement = rootElement;
        this.schema = schema;
        this.workspaceMount = null;
        this.rendered = false;
    }

    render() {
        this.rootElement.replaceChildren();
        this.rootElement.classList.add("qc-workspace-page-root");
        this.rootElement.dataset.qcTool = this.schema.id;

        const page = document.createElement("div");
        page.className = "qc-workspace-page";

        page.appendChild(createSiteHeader(this.schema.header));

        const main = document.createElement("main");
        const intro = document.createElement("div");
        intro.className = "qc-shell-container qc-workspace-page__intro";
        intro.append(
            createBreadcrumb(this.schema.breadcrumb || []),
            createToolHero(this.schema.hero)
        );

        const workspaceSection = document.createElement("section");
        workspaceSection.className = "qc-shell-container qc-workspace-stage";
        workspaceSection.setAttribute("aria-label", this.schema.hero?.title || "Document workspace");

        this.workspaceMount = document.createElement("div");
        this.workspaceMount.className = "qc-workspace-stage__mount";
        this.workspaceMount.dataset.qcWorkspaceMount = "";
        workspaceSection.appendChild(this.workspaceMount);

        main.append(intro, workspaceSection);

        if (this.schema.relatedTools) {
            const wrap = document.createElement("div");
            wrap.className = "qc-shell-container";
            wrap.appendChild(createRelatedTools(this.schema.relatedTools));
            main.appendChild(wrap);
        }

        if (this.schema.faq) {
            const wrap = document.createElement("div");
            wrap.className = "qc-shell-container";
            wrap.appendChild(createFaqSection(this.schema.faq));
            main.appendChild(wrap);
        }

        if (this.schema.trust) {
            const wrap = document.createElement("div");
            wrap.className = "qc-shell-container";
            wrap.appendChild(createTrustSection(this.schema.trust));
            main.appendChild(wrap);
        }

        page.append(main, createSiteFooter(this.schema.footer));
        this.rootElement.appendChild(page);
        this.rendered = true;
        return this;
    }

    getWorkspaceMount() {
        if (!this.rendered || !this.workspaceMount) {
            throw new Error("WorkspaceTemplate must be rendered before requesting its workspace mount.");
        }
        return this.workspaceMount;
    }

    getWorkspaceConfig(overrides = {}) {
        return {
            ...this.schema.workspace,
            ...overrides,
            toolbar: {
                ...(this.schema.workspace.toolbar || {}),
                ...(overrides.toolbar || {})
            }
        };
    }

    destroy() {
        this.rootElement.replaceChildren();
        this.rootElement.classList.remove("qc-workspace-page-root");
        delete this.rootElement.dataset.qcTool;
        this.workspaceMount = null;
        this.rendered = false;
    }
}

export function createWorkspaceTemplate(rootElement, schema) {
    return new WorkspaceTemplate(rootElement, schema).render();
}
