import { runMergeTool } from './mergeTool.js';
import { runSplitTool } from './splitTool.js';
import { runRotateTool } from './rotateTool.js';
import { runCompressTool } from './compressTool.js';
import { runProtectTool } from './protectTool.js';
import { runUnlockTool } from './unlockTool.js';
import { runWatermarkTool } from './watermarkTool.js';
import { runRearrangeTool } from './rearrangeTool.js';
import {runDeletePagesTool } from './deletePagesTool.js';
import {runDuplicatePagesTool} from './duplicatePagesTool.js';
import {runExtractPagesTool} from './extractPagesTool.js';



const tools = {
    merge: runMergeTool,
    split: runSplitTool,
    rotate: runRotateTool,
    compress: runCompressTool,
    protect: runProtectTool,
    unlock: runUnlockTool,
    watermark: runWatermarkTool,
    rearrange: runRearrangeTool,
    'delete-pages': runDeletePagesTool,
    'duplicate-pages': runDuplicatePagesTool,
    'extract-pages': runExtractPagesTool,

};

export function getTool(toolName) {
    return tools[toolName] || null;
}

export function hasTool(toolName) {
    return Boolean(tools[toolName]);
}

export function getAvailableTools() {
    return Object.keys(tools);
}