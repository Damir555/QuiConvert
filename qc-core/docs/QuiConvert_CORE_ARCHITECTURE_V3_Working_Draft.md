# QuiConvert -- CORE_ARCHITECTURE_V3 (Working Draft)

> Integral architecture snapshot prepared after completion of Sprint
> 17.3.

## Purpose

This document captures the current architecture of QuiConvert Workspace
so it can be restored if a conversation is interrupted.

## Current Workspace Architecture

``` text
WorkspaceEngine
        │
        ▼
WorkspaceStore
        │
        ▼
DocumentSession
        │
        ▼
EventBus
        │
 ┌──────┴───────────────┐
 ▼                      ▼
PreviewZone       (future) ThumbnailZone
 ▼                      ▼
PreviewRenderer   ThumbnailRenderer
 ▼                      ▼
PageViewer        pdfRenderer
        \          /
         ▼        ▼
            PDF.js
```

## Completed Milestones

### Backend

-   Merge
-   Split
-   Rotate
-   Compress
-   Rearrange
-   Delete Pages
-   Duplicate Pages
-   Protect
-   Unlock
-   Watermark
-   Unicode support

### Workspace Infrastructure

-   WorkspaceEngine
-   WorkspaceLayout
-   WorkspaceStore
-   DocumentSession
-   EventBus
-   SelectionManager
-   PreviewZone
-   PreviewRenderer
-   PageViewer integration

## Event Flow

``` text
PreviewRenderer
        │
        ▼
PreviewZone
        │
        ▼
DocumentSession.setActivePage()
        │
        ▼
WorkspaceStore
        │
        ▼
WorkspaceEvents.ACTIVE_PAGE_CHANGED
        │
        ▼
PreviewZone
        │
        ▼
PreviewRenderer.setCurrentPage()
```

## Session Responsibilities

DocumentSession owns: - activePage - pageCount - status - revision -
dirty - destroyed - error

WorkspaceDocument contains only immutable document metadata.

## EventBus

Current public API:

-   constructor()
-   on()
-   off()
-   emit()
-   listenerCount()
-   hasListeners()
-   removeAllListeners()
-   destroy()

## Sprint Status

### Completed

-   Sprint 17.1 -- Session-aware Preview
-   Sprint 17.2 -- Partial Session UI Refresh
-   Sprint 17.3 -- Workspace Lifecycle & Event Cleanup

### Next

Sprint 18: - ThumbnailRenderer - ThumbnailZone - Active page
thumbnails - Selection integration - Rearrange-ready architecture

## Design Principles

1.  Single responsibility.
2.  Zones orchestrate, renderers render.
3.  DocumentSession is the single source of truth for document runtime
    state.
4.  WorkspaceStore owns sessions.
5.  EventBus decouples components.
6.  Preview and Thumbnail systems remain independent.

------------------------------------------------------------------------

This document is intended to be versioned and expanded after each
completed sprint.
