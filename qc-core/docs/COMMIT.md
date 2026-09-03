# Sprint 05 / Commit 02

## Capability System Foundation

Type: Infrastructure Commit  
Status: Ready for manual verification

## Purpose

Introduce a canonical, validated capability contract between a PDF tool and the Workspace Engine.

The commit adds no dynamic zone visibility and makes no visual UI changes. It only establishes the data model that future Workspace zones can consume.

## Included files

- `qc-core/src/shared/toolCapabilities.js` — new canonical defaults and resolver.
- `qc-core/src/workspace/workspaceEngine.js` — complete updated Engine file.
- `qc-core/dev/capability-test.html` — standalone browser test.
- `docs/COMMIT.md`
- `docs/CHANGELOG.md`
- `docs/TESTPLAN.md`
- `docs/ROADMAP.md`
- `docs/VERSION.md`

## Architectural decisions

- Workspace consumes capabilities, not tool IDs.
- Capability names are canonical and finite.
- Capability values are booleans.
- Every resolved profile is complete and immutable.
- Unknown capability names fail early instead of being silently ignored.
- `toolRegistry.js` remains unchanged because execution dispatch and capability description are separate responsibilities.
- Existing `loadCapability()` is preserved as the Engine loading API.
- Both `config.capabilities` and the earlier singular `config.capability` are accepted; plural form is canonical.

## Out of scope

- Zone show/hide behavior.
- Toolbar action changes.
- Tool-definition migration.
- Action Registry.
- Undo/Redo.
