export * from "./workspaceEngine.js";
export * from "./workspaceState.js";
export * from "./workspaceEvents.js";
export * from "./eventBus.js";
export * from "./workspaceLayout.js";
export * from "./selectionManager.js";
export * from "./workspaceApplication.js";

import {
    WorkspaceApplication
} from "./workspaceApplication.js";

export function createWorkspaceApplication(
    rootElement,
    config = {}
) {

    const application =
        new WorkspaceApplication(
            config
        );

    application
        .initialize()
        .mount(
            rootElement
        );

    return application;

}