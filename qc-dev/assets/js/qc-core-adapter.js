import {
    initQuiConvertCore
} from '../core/qc-core.mjs';

function initializeQuiConvertBlocks() {
    const roots =
        document.querySelectorAll(
            '.qc-core-app[data-tool]'
        );

    if (roots.length === 0) {
        return;
    }

    roots.forEach((root) => {
        const tool =
            root.dataset.tool || 'merge';

        if (!root.id) {
            console.error(
                '[QC WordPress Adapter] ' +
                'The application root requires a unique ID.'
            );

            return;
        }

        const app =
            initQuiConvertCore({
                rootSelector: `#${root.id}`,
                tool,
                apiBase:
                    window.qcConfig?.apiBase || ''
            });

        if (!app) {
            console.error(
                '[QC WordPress Adapter] ' +
                `Initialization failed for tool: ${tool}`
            );

            return;
        }

        console.log(
            '[QC WordPress Adapter] Initialized:',
            tool
        );
    });
}

if (document.readyState === 'loading') {
    document.addEventListener(
        'DOMContentLoaded',
        initializeQuiConvertBlocks
    );
} else {
    initializeQuiConvertBlocks();
}