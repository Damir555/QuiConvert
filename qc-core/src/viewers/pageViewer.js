import {
    renderPdfPageThumbnail
} from "../../renderers/pdfRenderer.js";

export class PageViewer {

    constructor(container) {

        if (!(container instanceof HTMLElement)) {
            throw new TypeError(
                "PageViewer requires a valid container."
            );
        }

        this.container = container;
        this.renderToken = 0;
    }

    async showPage(
        pdfDocument,
        pageNumber = 1,
        options = {}
    ) {

        const token = ++this.renderToken;

        this.clear();

        const loading =
            document.createElement("p");

        loading.textContent =
            "Rendering page...";

        this.container.appendChild(loading);

        try {

            const {
                canvas
            } = await renderPdfPageThumbnail(
                pdfDocument,
                pageNumber,
                options
            );

            if (token !== this.renderToken) {
                return;
            }

            this.clear();

            this.container.appendChild(canvas);

        } catch (error) {

            if (token !== this.renderToken) {
                return;
            }

            this.showError(error);

        }

    }

    async showPages(
        pdfDocument,
        options = {}
    ) {

        const token = ++this.renderToken;

        this.clear();

        const loading =
            document.createElement("p");

        loading.textContent =
            "Rendering pages...";

        this.container.appendChild(loading);

        try {

            this.clear();

            for (
                let pageNumber = 1;
                pageNumber <= pdfDocument.numPages;
                pageNumber++
            ) {

                if (token !== this.renderToken) {
                    return;
                }

                const {
                    canvas
                } =
                    await renderPdfPageThumbnail(
                        pdfDocument,
                        pageNumber,
                        options
                    );

                if (token !== this.renderToken) {
                    return;
                }

                const wrapper =
                    document.createElement("div");

                wrapper.className =
                    "qc-page-viewer__page";

                const label =
                    document.createElement("div");

                label.textContent =
                    `Page ${pageNumber}`;

                label.className =
                    "qc-page-viewer__label";

                wrapper.append(
                    canvas,
                    label
                );

                this.container.appendChild(
                    wrapper
                );

            }

        } catch (error) {

            if (token !== this.renderToken) {
                return;
            }

            this.showError(error);

        }

    }

    showError(error) {

        this.clear();

        const message =
            document.createElement("p");

        message.textContent =
            "Page rendering failed.";

        this.container.appendChild(
            message
        );

        console.error(error);

    }

    clear() {

        this.container.innerHTML = "";

    }

    destroy() {

        this.renderToken++;

        this.clear();

    }

}