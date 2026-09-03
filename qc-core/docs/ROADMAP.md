# Roadmap

## Sprint 05 — Workspace Intelligence

### Commit 01 — Toolbar Zone Foundation + State Binding

Status: Completed and manually verified.

### Commit 02 — Capability System Foundation

Status: Current commit; ready for manual verification.

Deliverables:

- canonical capability dictionary
- validated resolver
- Workspace Engine integration
- public `getCapabilities()` API
- isolated test page

### Commit 03 — Dynamic Zone Visibility

Planned after Commit 02 is verified.

Expected scope:

- zones observe the active resolved capability profile
- Preview, Thumbnail, Tool, and Action zones become capability-driven
- no `if (tool === "...")` conditions
- capability changes are distributed through a dedicated Workspace event if runtime profile switching is required

## Later work

- Tool definitions adopt explicit capability profiles.
- Action Registry is introduced when multiple reusable Workspace actions justify it.
- Architecture Freeze v1.1 documentation is finalized after Sprint 05.
