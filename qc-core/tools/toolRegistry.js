import { runMergeTool } from './mergeTool.js';
import { runSplitTool } from './splitTool.js';
import { runRotateTool } from './rotateTool.js';
import { runCompressTool } from './compressTool.js';
import { runProtectTool } from './protectTool.js';
import { runUnlockTool } from './unlockTool.js';
import { runWatermarkTool } from './watermarkTool.js';

const tools = {
    merge: runMergeTool,
    split: runSplitTool,
    rotate: runRotateTool,
    compress: runCompressTool,
    protect: runProtectTool,
    unlock: runUnlockTool,
    watermark: runWatermarkTool
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