import { runMergeTool } from './mergeTool.js';
import { runSplitTool } from './splitTool.js';
import { runRotateTool } from './rotateTool.js';
import { runCompressTool } from './compressTool.js';
import { runProtectTool } from './protectTool.js';

const tools = {
    merge: runMergeTool,
    split: runSplitTool,
    rotate: runRotateTool,
    compress: runCompressTool,
    protect: runProtectTool
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