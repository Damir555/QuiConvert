import { runMergeTool } from './mergeTool.js';
import { runSplitTool } from './splitTool.js';
import { runRotateTool } from './rotateTool.js';

const tools = {
    merge: runMergeTool,
    split: runSplitTool,
    rotate: runRotateTool
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