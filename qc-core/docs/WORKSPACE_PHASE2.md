# QuiConvert — Workspace Phase 2

## Objective

Integrate the existing qc-core processing pipeline into the new Workspace architecture without breaking separation of responsibilities.

---

# Current Architecture

WorkspaceApplication

↓

WorkspaceEngine

↓

WorkspaceStore

↓

DocumentSession

↓

Workspace Zones

- UploadZone
- FilesZone
- ThumbnailZone
- PreviewZone

---

Existing Processing Pipeline

application.js

↓

dispatchTool()

↓

Tool

↓

Backend API

---

# Problem

The Workspace architecture currently manages documents and UI.

The processing pipeline still belongs to the legacy application.

These two systems are not yet connected.

---

# Design Goal

Workspace becomes the entry point for processing.

Dispatcher remains generic.

Tools remain generic.

Business state stays inside DocumentSession.

---

# New Component

WorkspaceProcessor

Responsibilities:

- obtain active DocumentSession
- collect processing data
- build ToolOptions
- call dispatchTool()
- return processing result

WorkspaceProcessor owns NO UI.

WorkspaceProcessor owns NO business state.

---

# Data Flow

Process Button

↓

WorkspaceProcessor

↓

DocumentSession

↓

Tool Options Builder

↓

dispatchTool()

↓

Tool

↓

Backend

↓

Result

↓

Workspace Zones

---

# Responsibilities

## WorkspaceApplication

Application lifecycle

Zone management

Initialization

No processing logic.

---

## WorkspaceProcessor

Processing orchestration

Build ToolOptions

Call Dispatcher

Return result

---

## Dispatcher

Locate tool

Execute tool

Nothing else.

---

## Tool

Receive complete ToolOptions.

Perform one processing task.

No knowledge of Workspace.

---

## DocumentSession

Single source of truth.

Owns:

- document
- page order
- active page
- selection
- future metadata

---

# Future Tool Options

Example

{
    pageOrder,
    activePage,
    selectedPages,
    rotation,
    password,
    watermark,
    ...
}

Everything required by a tool should already exist here before Dispatcher is called.

---

# Architectural Rules

DocumentSession owns state.

WorkspaceProcessor builds options.

Dispatcher dispatches.

Tools execute.

Renderer renders.

Zones synchronize.

---

# Phase 2 Milestones

20.4

WorkspaceProcessor

20.5

Tool Options Builder

20.6

Rearrange integration

20.7

Delete Pages integration

20.8

Duplicate Pages integration

20.9

Rotate Selected Pages

21.0

Workspace Processing Pipeline complete.