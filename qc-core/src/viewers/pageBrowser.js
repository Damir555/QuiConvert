import { PageViewer } from "./pageViewer.js";

export class PageBrowser {

    constructor(container) {

        if (!(container instanceof HTMLElement)) {
            throw new TypeError(
                "PageBrowser requires a valid container."
            );
        }

        this.container = container;

        this.pageViewers = [];

        this.renderToken = 0;
    }

    async showDocument(
        pdfDocument,
        options = {}
    ) {

        if (!pdfDocument) {
            throw new TypeError(
                "A PDF document is required."
            );
        }

        const token = ++this.renderToken;

        this.destroyViewers();
        this.clear();

        const grid =
            document.createElement("div");

        grid.className =
            "qc-page-browser";

        this.container.appendChild(grid);

        for (
            let pageNumber = 1;
            pageNumber <= pdfDocument.numPages;
            pageNumber++
        ) {

            if (token !== this.renderToken) {
                return;
            }

            const pageContainer =
                document.createElement("div");

            pageContainer.className =
                "qc-page-browser__page";

            const label =
                document.createElement("div");

            label.className =
                "qc-page-browser__label";

            label.textContent =
                `Page ${pageNumber}`;

            const canvasHost =
                document.createElement("div");

            canvasHost.className =
                "qc-page-browser__canvas";

            pageContainer.append(
                canvasHost,
                label
            );

            grid.appendChild(pageContainer);

            const viewer =
                new PageViewer(canvasHost);

            this.pageViewers.push(viewer);

            await viewer.showPage(
                pdfDocument,
                pageNumber,
                options
            );

        }

    }

    clear() {

        this.container.innerHTML = "";

    }

    destroyViewers() {

        for (const viewer of this.pageViewers) {
            viewer.destroy();
        }

        this.pageViewers = [];

    }

    destroy() {

        this.renderToken++;

        this.destroyViewers();

        this.clear();

    }

}