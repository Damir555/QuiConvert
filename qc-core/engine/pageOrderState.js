let pageOrder = [];

export function setPageOrder(order) {
    if (!Array.isArray(order)) {
        throw new Error('Page order must be an array.');
    }

    const normalizedOrder = order.map((pageNumber) => {
        const value = Number(pageNumber);

        if (!Number.isInteger(value) || value < 1) {
            throw new Error(
                `Invalid page number: ${pageNumber}`
            );
        }

        return value;
    });

    pageOrder = [...normalizedOrder];

    return getPageOrder();
}

export function initializePageOrder(pageCount) {
    if (!Number.isInteger(pageCount) || pageCount < 1) {
        throw new Error(
            'Page count must be a positive integer.'
        );
    }

    pageOrder = Array.from(
        { length: pageCount },
        (_, index) => index + 1
    );

    return getPageOrder();
}

export function getPageOrder() {
    return [...pageOrder];
}

export function movePage(fromIndex, toIndex) {
    validateIndex(fromIndex, 'source');
    validateIndex(toIndex, 'target');

    if (fromIndex === toIndex) {
        return getPageOrder();
    }

    const nextOrder = [...pageOrder];
    const [movedPage] = nextOrder.splice(fromIndex, 1);

    nextOrder.splice(toIndex, 0, movedPage);
    pageOrder = nextOrder;

    return getPageOrder();
}

export function resetPageOrder() {
    pageOrder = [];
}

export function serializePageOrder() {
    return pageOrder.join(',');
}

function validateIndex(index, label) {
    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= pageOrder.length
    ) {
        throw new Error(
            `Invalid ${label} page index: ${index}`
        );
    }
}