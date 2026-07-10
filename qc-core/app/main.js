import { defaultConfig } from '../config/defaultConfig.js';
import { createApplication } from './application.js';

export function initQuiConvertCore(userConfig = {}) {
    const config = {
        ...defaultConfig,
        ...userConfig
    };

    const root = document.querySelector(config.rootSelector);

    if (!root) {
        console.error('[QuiConvert Core] Root element not found:', config.rootSelector);
        return null;
    }

    const app = createApplication(config, root);

    console.log('[QuiConvert Core] Initialized');
    console.log('[QuiConvert Core] Config:', config);

    return app;
}