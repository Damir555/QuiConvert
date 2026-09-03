import {
    createUploadEngine
} from '../engine/uploadEngine.js';

import {
    dispatchTool
} from '../engine/dispatcher.js';

import {
    bindProcessButton
} from '../ui/processView.js';

import {
    showStatus,
    showDownload
} from '../ui/resultView.js';

import {
    showError
} from '../ui/errorView.js';

import {
    renderToolOptions
} from '../ui/toolOptionsView.js';

export function createApplication(
    config,
    root
) {
    const uploadEngine =
        createUploadEngine({
            root,
            multiple: Boolean(
                config.toolDefinition?.multiple
            )
        });

    const toolOptionsContainer =
        root.querySelector(
            '.qc-tool-options-container'
        );

    const resultContainer =
        root.querySelector(
            '.qc-result-container'
        );

    const toolOptionsView =
        toolOptionsContainer
            ? renderToolOptions(
                toolOptionsContainer,
                config.tool
            )
            : null;

    async function run() {
        console.log(
            '[QuiConvert Core] Running tool:',
            config.tool
        );

        const options =
            toolOptionsView?.getOptions
                ? toolOptionsView.getOptions()
                : {};

        console.log(
            '[QuiConvert Core] Tool options:',
            options
        );

        showStatus(
            resultContainer,
            'Processing...'
        );

        try {
            const result =
                await dispatchTool(
                    config,
                    options
                );

            showDownload(
                resultContainer,
                result.blob,
                result.filename
            );

            return result;
        } catch (error) {
            console.error(
                '[QuiConvert Core] Processing failed:',
                error
            );

            showError(
                resultContainer,
                error.message ||
                    'Processing failed.'
            );

            return null;
        }
    }

    bindProcessButton(
        root,
        run
    );

    return {
        config,
        root,
        uploadEngine,
        toolOptionsView,
        run
    };
}