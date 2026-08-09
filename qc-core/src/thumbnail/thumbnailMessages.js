export function renderThumbnailError(
    item,
    pageNumber
) {

    const canvasHost =
        item.querySelector(
            '[data-qc-role="thumbnail-canvas-host"]'
        );

    if (!canvasHost) {
        return;
    }

    canvasHost.innerHTML =
        "";

    const message =
        document.createElement(
            "span"
        );

    message.className =
        "qc-thumbnail-error";

    message.textContent =
        `Page ${pageNumber} unavailable`;

    canvasHost.appendChild(
        message
    );

}

export function renderMessage(
    container,
    text
) {

    const message =
        document.createElement(
            "p"
        );

    message.dataset.qcRole =
        "thumbnail-message";

    message.textContent =
        text;

    container.appendChild(
        message
    );

}

export function renderError(
    container,
    error
) {

    container.innerHTML =
        "";

    const message =
        document.createElement(
            "p"
        );

    message.dataset.qcRole =
        "thumbnail-error";

    message.textContent =
        "PDF thumbnails could not be rendered.";

    container.appendChild(
        message
    );

    console.error(
        "Thumbnail rendering failed:",
        error
    );

}
