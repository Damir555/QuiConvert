import {
    renderRearrangeOptionsView
} from '../rearrangeOptionsView.js';

import {
    renderDeletePagesOptionsView
} from '../deletePagesOptionsView.js';

import {
    renderDuplicatePagesOptionsView
} from '../duplicatePagesOptionsView.js';

import {
    renderExtractPagesOptionsView
} from '../extractPagesOptionsView.js';

const CUSTOM_TOOL_VIEWS = {
    rearrange:
        renderRearrangeOptionsView,

    'delete-pages':
        renderDeletePagesOptionsView,

    'duplicate-pages':
        renderDuplicatePagesOptionsView,

    'extract-pages':
        renderExtractPagesOptionsView
};

export function renderCustomToolView(
    container,
    tool
) {
    const renderer =
        CUSTOM_TOOL_VIEWS[tool];

    if (typeof renderer !== 'function') {
        return null;
    }

    return renderer(container);
}