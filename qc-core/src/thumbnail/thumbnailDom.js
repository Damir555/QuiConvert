/**
 * Stateless DOM helpers for PDF thumbnail items.
 */
export function createThumbnailItem(
    pageNumber,
    { rearrangeEnabled = false } = {}
) {

    const item = document.createElement(
        "button"
    );

    item.type = "button";
    item.className = "qc-thumbnail-item";
    item.dataset.qcRole = "thumbnail-item";
    item.dataset.pageNumber = String(
        pageNumber
    );
    item.draggable = rearrangeEnabled;

    item.setAttribute(
        "aria-label",
        `Open page ${pageNumber}`
    );
    item.setAttribute(
        "aria-pressed",
        "false"
    );

    if (rearrangeEnabled) {
        item.dataset.rearrangeEnabled =
            "true";
        item.title =
            "Drag to rearrange this page";
    }

    const canvasHost =
        document.createElement(
            "span"
        );
    canvasHost.className =
        "qc-thumbnail-canvas-host";
    canvasHost.dataset.qcRole =
        "thumbnail-canvas-host";

    const loadingMessage =
        document.createElement(
            "span"
        );
    loadingMessage.className =
        "qc-thumbnail-loading";
    loadingMessage.textContent =
        "Loading…";
    canvasHost.appendChild(
        loadingMessage
    );

    const pageLabel =
        document.createElement(
            "span"
        );
    pageLabel.className =
        "qc-thumbnail-page-label";
    pageLabel.dataset.qcRole =
        "thumbnail-page-label";
    pageLabel.textContent =
        `Page ${pageNumber}`;

    item.append(
        canvasHost,
        pageLabel
    );

    return item;
}

export function getThumbnailItemFromEvent(
    event,
    listElement
) {

    if (!listElement) {
        return null;
    }

    const target = event.target;

    if (!(target instanceof Element)) {
        return null;
    }

    const item = target.closest(
        '[data-qc-role="thumbnail-item"]'
    );

    if (
        !item ||
        !listElement.contains(item)
    ) {
        return null;
    }

    return item;
}

export function getThumbnailItems(
    listElement
) {

    if (!listElement) {
        return [];
    }

    return Array.from(
        listElement.querySelectorAll(
            '[data-qc-role="thumbnail-item"]'
        )
    );
}

export function getItemPageNumber(item) {

    return Number.parseInt(
        item.dataset.pageNumber || "",
        10
    );
}
