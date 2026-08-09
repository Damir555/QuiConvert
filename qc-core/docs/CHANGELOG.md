# Changelog

## Sprint 05 / Commit 02 — Capability System Foundation

### Added

- Canonical `DEFAULT_TOOL_CAPABILITIES` object.
- `resolveToolCapabilities()` validation and normalization function.
- `WorkspaceEngine.getCapabilities()` public API.
- Automatic capability resolution during `WorkspaceEngine.initialize()`.
- Standalone browser test for defaults, overrides, immutability, and validation.

### Changed

- Workspace Engine now stores a complete resolved capability profile rather than an arbitrary raw object.
- `loadCapability()` now validates and resolves partial capability input.
- Engine destruction clears the resolved capability profile.

### Preserved

- Existing Workspace state transitions.
- EventBus behavior.
- Workspace Store and Selection Manager behavior.
- Layout and zone lifecycle.
- Existing `loadCapability()` method name.

### Removed

- No public functionality was removed.
