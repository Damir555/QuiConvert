const CUSTOM_TOOL_VIEWS = Object.freeze({});

export function renderCustomToolView(
    container,
    tool
) {
    if (!(container instanceof HTMLElement)) {
        throw new TypeError(
            'A valid custom tool view container is required.'
        );
    }

    const renderer =
        CUSTOM_TOOL_VIEWS[tool];

    if (typeof renderer !== 'function') {
        return null;
    }

    return renderer(container);
}