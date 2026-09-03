import {
    postPdfTool
} from "../engine/apiClient.js";

import {
    requireSingleFile,
    createSingleFileFormData
} from "./toolHelpers.js";

export async function runRearrangeTool(
    config,
    options = {}
) {

    validateOptions(options);

    const file =
        resolveWorkspaceFile(
            options.document
        ) ??
        requireSingleFile();

    const pageOrder =
        resolvePageOrder(
            options.pageOrder
        );

    const formData =
        createSingleFileFormData(
            config,
            file
        );

    formData.append(
        "page_order",
        serializePageOrder(
            pageOrder
        )
    );

    return await postPdfTool(
        config,
        "/api/pdf/rearrange",
        formData
    );

}

function validateOptions(options) {

    if (
        options === null ||
        typeof options !== "object" ||
        Array.isArray(options)
    ) {
        throw new TypeError(
            "Rearrange tool options must be an object."
        );
    }

}

function resolveWorkspaceFile(document) {

    if (
        !document ||
        typeof document !== "object"
    ) {
        return null;
    }

    if (
        typeof File !== "undefined" &&
        document.file instanceof File
    ) {
        return document.file;
    }

    if (
        typeof document.getFile === "function"
    ) {

        const file =
            document.getFile();

        if (
            typeof File !== "undefined" &&
            file instanceof File
        ) {
            return file;
        }

    }

    return null;

}

function resolvePageOrder(value) {

    if (Array.isArray(value)) {

        return normalizePageOrder(
            value
        );

    }

    if (
        typeof value === "string"
    ) {

        const pageOrder =
            value
                .split(",")
                .map(item =>
                    item.trim()
                )
                .filter(Boolean);

        return normalizePageOrder(
            pageOrder
        );

    }

    throw new Error(
        "A valid page order is required."
    );

}

function normalizePageOrder(pageOrder) {

    if (pageOrder.length < 1) {
        throw new Error(
            "Page order cannot be empty."
        );
    }

    const normalizedOrder =
        pageOrder.map(
            pageNumber =>
                normalizePageNumber(
                    pageNumber
                )
        );

    const uniquePages =
        new Set(
            normalizedOrder
        );

    if (
        uniquePages.size !==
        normalizedOrder.length
    ) {
        throw new Error(
            "Page order cannot contain duplicate pages."
        );
    }

    const expectedPages =
        Array.from(
            {
                length:
                    normalizedOrder.length
            },
            (_, index) =>
                index + 1
        );

    const containsAllPages =
        expectedPages.every(
            pageNumber =>
                uniquePages.has(
                    pageNumber
                )
        );

    if (!containsAllPages) {
        throw new Error(
            "Page order must contain every page exactly once."
        );
    }

    return normalizedOrder;

}

function normalizePageNumber(value) {

    const pageNumber =
        typeof value === "number"
            ? value
            : Number(value);

    if (
        !Number.isInteger(pageNumber) ||
        pageNumber < 1
    ) {
        throw new Error(
            `Invalid page number: ${String(value)}`
        );
    }

    return pageNumber;

}

function serializePageOrder(pageOrder) {

    return pageOrder.join(",");

}
