# QuiConvert Workspace Audit v1

## Scope

This audit is based on the supplied `qc-core` project archive and focuses on the active Workspace implementation under `src/`.

## Confirmed strengths

- `WorkspaceApplication` already composes the engine, processor and zones.
- `WorkspaceEngine`, `WorkspaceLayout`, `WorkspaceStore`, `DocumentSession` and the event system are separated.
- Workspace zones are mounted through a consistent lifecycle.
- Processing follows the intended path: zone → application/processor → dispatcher/API layer.
- Capability-driven visibility already exists in `WorkspaceLayout`.
- The development page proves that the engine can mount into an arbitrary root element.

## Important repository observation

The archive contains both an older implementation under `app/` and the newer Workspace architecture under `src/`. Sprint 1 must build on `src/`, because `dev/workspace-dev.html` imports `../src/workspace/index.js` and the mature zone lifecycle lives there.

## Gaps relative to Canonical UI

- No public page shell surrounds the Workspace.
- No schema controls hero, breadcrumbs, FAQ, related tools, trust content and footer.
- Current `workspace-dev.html` is an engine test page, not a product page.
- `workspace-dev.css` is useful for development but is not yet a public design system.

## Decision

Do not refactor the Workspace Engine in Sprint 1.

Build a reusable Workspace Template around the existing engine and mount the engine into a dedicated template-owned element.

## Priority

> The highest priority is not refactoring the Workspace Engine, but presenting the existing engine through the Canonical UI shell.
