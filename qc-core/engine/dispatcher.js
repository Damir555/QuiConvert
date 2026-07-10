import { getTool } from '../tools/toolRegistry.js';

export async function dispatchTool(config, options = {}) {
    const tool = getTool(config.tool);

    if (!tool) {
        throw new Error(`Unknown tool: ${config.tool}`);
    }

    return await tool(config, options);
}