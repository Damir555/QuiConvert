import { createUploadEngine } from '../engine/uploadEngine.js';
import { dispatchTool } from '../engine/dispatcher.js';
import { bindProcessButton } from '../ui/processView.js';
import { showStatus, showDownload } from '../ui/resultView.js';
import { showError } from '../ui/errorView.js';

export function createApplication(config, root) {
    const uploadEngine = createUploadEngine({
        root
    });

    const resultContainer = root.querySelector('.qc-result-container');

    async function run(options = {}) {
        console.log('[QuiConvert Core] Running tool:', config.tool);

        showStatus(resultContainer, 'Processing...');

        try {
            const resultBlob = await dispatchTool(config, options);
            showDownload(resultContainer, resultBlob, 'quiconvert-result.pdf');
            return resultBlob;
        } catch (error) {
            console.error('[QuiConvert Core] Processing failed:', error);
            showError(resultContainer, error.message || 'Processing failed.');
            return null;
        }
    }

    bindProcessButton(root, () => run());

    return {
        config,
        root,
        uploadEngine,
        run
    };
}