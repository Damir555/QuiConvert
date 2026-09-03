export const WorkspaceState = Object.freeze({
    EMPTY: "EMPTY",
    READY: "READY",
    PROCESSING: "PROCESSING",
    SUCCESS: "SUCCESS",
    ERROR: "ERROR"
});

const allowedTransitions = Object.freeze({
    [WorkspaceState.EMPTY]: [
        WorkspaceState.READY
    ],

    [WorkspaceState.READY]: [
        WorkspaceState.PROCESSING,
        WorkspaceState.EMPTY
    ],

    [WorkspaceState.PROCESSING]: [
        WorkspaceState.SUCCESS,
        WorkspaceState.ERROR
    ],

    [WorkspaceState.SUCCESS]: [
        WorkspaceState.READY,
        WorkspaceState.EMPTY
    ],

    [WorkspaceState.ERROR]: [
        WorkspaceState.READY,
        WorkspaceState.EMPTY
    ]
});

export function isWorkspaceState(value) {
    return Object.values(WorkspaceState).includes(value);
}

export function canTransitionWorkspaceState(currentState, nextState) {
    if (!isWorkspaceState(currentState) || !isWorkspaceState(nextState)) {
        return false;
    }

    if (currentState === nextState) {
        return true;
    }

    return allowedTransitions[currentState]?.includes(nextState) ?? false;
}