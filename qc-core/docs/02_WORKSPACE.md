# 02_WORKSPACE.md

1. Purpose
2. Scope
3. Definitions
4. Responsibilities
5. User Workflow
6. Workspace Layout
7. Sections
8. Zones
9. Workspace Lifecycle
10. State Machine
11. Interaction Rules
12. Workspace Contract
13. Extension Points
14. Design Rationale


# 1. Purpose

The Workspace is the primary interaction environment of QuiConvert.

Every document operation is performed inside a single Workspace.

The Workspace provides one consistent interaction model regardless of
which Capability is currently active.

Its purpose is to guide the user from document selection to result
delivery in a predictable, recoverable and extensible workflow.


# 2. Scope

The Workspace is responsible for the user interaction layer.

It owns:

- document workflow
- application state
- validation
- visibility
- interaction
- result presentation

The Workspace is NOT responsible for:

- document processing
- PDF manipulation
- backend implementation
- storage
- authentication


# 3. Definitions

## Workspace

The primary interaction environment where a user performs a document operation.

There is exactly one active Workspace on a production page.

---

## Capability

A self-contained document operation that extends the Workspace.

Examples include Merge PDF, Split PDF and Rotate PDF.

Capabilities describe requirements and behaviour but do not own application state.

---

## Workspace Engine

The component responsible for managing the Workspace lifecycle, state, validation and user interaction.

---

## Execution Engine

The component responsible for executing the active Capability and coordinating processing.

---

## Zone

A functional area inside the Workspace responsible for a specific part of the user interaction.

Examples include Upload Zone, Files Zone and Result Zone.

---

## Section

A logical grouping of related Workspace Zones.

Sections improve organisation but do not implement behaviour.

---

## Result

The output produced by a Capability.

A Result may be a downloadable file, a collection of files, textual information or another supported output type.


# 4. Responsibilities

The Workspace shall:

- receive user input
- validate documents
- activate Capabilities
- coordinate the workflow
- display processing status
- present results
- support recovery after errors

The Workspace shall not:

- manipulate documents
- implement Capability logic
- communicate directly with backend services


# 5. User Workflow

User

↓

Choose capability

↓

Upload documents

↓

Review documents

↓

Configure operation

↓

Execute

↓

Receive result

↓

Continue

or

Start over