export const DEFAULT_TOOL_CAPABILITIES = Object.freeze({
    preview: true,
    thumbnails: false,
    multiFile: false,
    pageReorder: false,
    pageSelection: false,
    toolOptions: true,
    processing: true
});

const TOOL_CAPABILITY_KEYS = Object.freeze(
    Object.keys(
        DEFAULT_TOOL_CAPABILITIES
    )
);

export function resolveToolCapabilities(
    capabilities = {}
) {
    if (
        capabilities === null ||
        typeof capabilities !== "object" ||
        Array.isArray(capabilities)
    ) {
        throw new TypeError(
            "Tool capabilities must be a plain object."
        );
    }

    const unknownCapabilityKeys =
        Object.keys(capabilities).filter(
            capabilityKey =>
                !TOOL_CAPABILITY_KEYS.includes(
                    capabilityKey
                )
        );

    if (unknownCapabilityKeys.length > 0) {
        throw new Error(
            `Unknown tool capabilities: ${unknownCapabilityKeys.join(", ")}`
        );
    }

    for (
        const capabilityKey of
        Object.keys(capabilities)
    ) {
        if (
            typeof capabilities[capabilityKey] !==
            "boolean"
        ) {
            throw new TypeError(
                `Tool capability "${capabilityKey}" must be a boolean.`
            );
        }
    }

    return Object.freeze({
        ...DEFAULT_TOOL_CAPABILITIES,
        ...capabilities
    });
}
