import {
    defaultConfig
} from '../config/defaultConfig.js';

import {
    getToolDefinition
} from '../config/toolDefinitions.js';

import {
    createApplication
} from './application.js';

export function initQuiConvertCore(
    userConfig = {}
) {
    const initialConfig = {
        ...defaultConfig,
        ...userConfig
    };

    let toolDefinition;

    try {
        toolDefinition =
            getToolDefinition(
                initialConfig.tool
            );
    } catch (error) {
        console.error(
            '[QuiConvert Core] Invalid tool:',
            error
        );

        return null;
    }

    const config = {
        ...initialConfig,
        toolDefinition
    };

    const root =
        document.querySelector(
            config.rootSelector
        );

    if (!root) {
        console.error(
            '[QuiConvert Core] Root element not found:',
            config.rootSelector
        );

        return null;
    }

    applyToolDefinition(
        root,
        config.toolDefinition
    );

    const app =
        createApplication(
            config,
            root
        );

    console.log(
        '[QuiConvert Core] Initialized'
    );

    console.log(
        '[QuiConvert Core] Config:',
        config
    );

    return app;
}

function applyToolDefinition(
    root,
    toolDefinition
) {
    const fileInput =
        root.querySelector(
            '.qc-file-input'
        );

    if (!fileInput) {
        console.warn(
            '[QuiConvert Core] File input not found.'
        );

        return;
    }

    fileInput.accept =
        toolDefinition.accepts || '';

    fileInput.multiple =
        Boolean(
            toolDefinition.multiple
        );

    fileInput.dataset.outputType =
        toolDefinition.output || '';

    root.dataset.toolTitle =
        toolDefinition.title || '';

    root.dataset.toolOutput =
        toolDefinition.output || '';
}