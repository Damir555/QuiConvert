# QuiConvert Core Architecture

## DocumentSession Design v1.0

**Status:** Proposed  
**Sprint:** 15  
**Scope:** Workspace document runtime state  
**Target module:** `qc-core/src/domain/documentSession.js`

---

## 1. Purpose

`DocumentSession` represents the active runtime state of one document inside the QuiConvert Workspace.

A `WorkspaceDocument` describes an imported file. A `DocumentSession` describes what the user is currently doing with that document.

This separation keeps imported document metadata stable while allowing interactive state to evolve during editing.

```text
WorkspaceDocument
        │
        │ source document
        ▼
DocumentSession
        │ runtime editing state
        ▼
Zones / Renderers / Tools
```

---

## 2. Core architectural rule

`WorkspaceDocument` remains an immutable-ish domain object.

It owns source-level information such as:

- document ID
- original `File`
- file name
- file size
- MIME type
- last-modified timestamp
- import status

It must not become a container for temporary UI or editing state.

`DocumentSession` owns state that exists only while the document is open in the Workspace.

---

## 3. Responsibilities

`DocumentSession` owns document-scoped runtime state.

Version 1 should support:

- active page
- page count
- page order
- page rotations
- selected page IDs
- document loading state
- document error state
- dirty state
- revision number

Future versions may add:

- undo/redo history
- deleted-page markers
- duplicated-page identities
- annotations
- OCR regions
- crop data
- tool-local state
- render cache references
- document metadata edits

---

## 4. Non-responsibilities

`DocumentSession` must not:

- render HTML
- render PDF canvases
- access DOM elements
- own `PreviewRenderer`
- own Workspace zones
- perform HTTP requests
- call backend PDF endpoints
- create download results
- replace `WorkspaceStore`
- replace `SelectionManager`
- directly control tool panels
- directly persist data to storage

It is a domain/runtime state object, not a UI component, renderer, API client, or application controller.

---

## 5. Relationship to WorkspaceDocument

Each session belongs to exactly one `WorkspaceDocument`.

```text
WorkspaceDocument 1 ───── 1 DocumentSession
```

The session may retain the document reference:

```javascript
this.document = workspaceDocument;
```

The original file is therefore still available through:

```javascript
session.getDocument().file
```

The session must never mutate the `WorkspaceDocument`.

---

## 6. Relationship to WorkspaceStore

`WorkspaceStore` owns workspace-level state:

- collection of imported documents
- active document ID
- future collection of sessions
- workspace-wide changes

`DocumentSession` owns state for one document.

Recommended future store shape:

```javascript
{
    documents: Map<documentId, WorkspaceDocument>,
    sessions: Map<documentId, DocumentSession>,
    activeDocumentId: string | null
}
```

The store is responsible for:

- creating a session when a document enters the Workspace
- returning the session for a document
- returning the active session
- removing the session when its document is removed
- clearing sessions during reset

The session does not search the store and does not select the active document.

---

## 7. Relationship to SelectionManager

`SelectionManager` remains the generic Workspace selection service.

Its selection format stays:

```javascript
{
    type: "page",
    id: 1
}
```

`DocumentSession` must not replace `SelectionManager`.

The responsibilities are different:

### SelectionManager

Answers:

> What entity is currently selected in the Workspace?

Possible future selection types:

- page
- document
- annotation
- OCR region
- result item

### DocumentSession

Answers:

> What is the runtime state of this particular document?

For page selection, application orchestration synchronizes them:

```text
User action
    │
    ▼
SelectionManager
    │ emits SELECTION_CHANGED
    ▼
Workspace orchestration
    │
    ▼
DocumentSession.setActivePage(pageId)
```

For navigation initiated by the session or renderer, orchestration may update the selection in the opposite direction.

Neither object should directly depend on the other in Version 1.

This prevents circular coupling.

---

## 8. Relationship to PreviewZone

`PreviewZone` remains the orchestration boundary between Workspace state and rendering.

Its responsibilities will be:

- obtain the active `DocumentSession`
- respond to store/session/selection events
- pass the session state to `PreviewRenderer`
- forward user navigation intent to the session or Workspace controller

It must not manually mutate session fields.

Example:

```javascript
const session =
    this.workspace.getActiveDocumentSession();

session.setActivePage(2);
```

---

## 9. Relationship to PreviewRenderer

`PreviewRenderer` renders a document session.

It should not become the authoritative owner of document navigation state.

Target direction:

```javascript
previewRenderer.render(
    previewContainer,
    documentSession
);
```

The renderer may keep technical rendering state such as:

- loaded PDF.js document handle
- current render task
- render token
- canvas reference
- PDF loading promise

It should not own authoritative domain state such as:

- selected page
- page order
- rotations
- dirty state
- edit history

The renderer reads those values from `DocumentSession`.

A temporary mirrored `currentPage` may remain during migration, but it must eventually be removed as the source of truth.

---

## 10. Initial state model

Recommended Version 1 properties:

```javascript
{
    document: WorkspaceDocument,
    pageCount: 0,
    activePage: null,
    pageOrder: [],
    pageRotations: Map,
    selectedPageIds: Set,
    status: "idle",
    error: null,
    dirty: false,
    revision: 0
}
```

### document

The associated `WorkspaceDocument`.

### pageCount

Number of pages in the loaded PDF.

Before PDF metadata is available:

```javascript
0
```

### activePage

One-based page identity currently active in the session.

Before page metadata is available:

```javascript
null
```

### pageOrder

Ordered page identities.

For a three-page document:

```javascript
[1, 2, 3]
```

The array represents logical output order, not necessarily original PDF.js indexes after editing.

### pageRotations

Rotation by page identity:

```javascript
Map([
    [1, 0],
    [2, 90],
    [3, 0]
])
```

Supported normalized values:

```text
0, 90, 180, 270
```

### selectedPageIds

Multi-page selection owned by the document editing model:

```javascript
new Set([2, 3])
```

This is different from the generic current Workspace selection.

### status

Recommended values:

```text
idle
loading
ready
error
destroyed
```

### error

Current document-session error or `null`.

### dirty

Whether the runtime state differs from the imported document.

### revision

Integer increased after every successful state mutation.

It gives renderers and future caches a simple invalidation signal.

---

## 11. Proposed public API

```javascript
export class DocumentSession {

    constructor(workspaceDocument)

    getDocument()

    getDocumentId()

    getStatus()

    getError()

    getPageCount()

    getActivePage()

    getPageOrder()

    getPageRotation(pageId)

    getSelectedPageIds()

    isDirty()

    getRevision()

    initializePages(pageCount)

    setActivePage(pageId)

    setPageOrder(pageOrder)

    rotatePage(pageId, rotation)

    selectPage(pageId)

    deselectPage(pageId)

    togglePageSelection(pageId)

    clearPageSelection()

    markClean()

    setLoading()

    setError(error)

    destroy()
}
```

Version 1 does not need every future editing method. The API should be introduced incrementally.

---

## 12. Invariants

The class must enforce the following rules.

### Valid document

The constructor requires a valid `WorkspaceDocument`-like object.

### One-based page identities

Page identities begin at `1`.

### Page range

An active or selected page must exist within:

```text
1 <= pageId <= pageCount
```

### Page order integrity

`pageOrder` must:

- contain exactly `pageCount` items
- contain only valid page identities
- contain no duplicates

### Rotation normalization

Rotation must normalize to one of:

```text
0, 90, 180, 270
```

### Defensive copies

Arrays and sets returned through getters must not expose mutable internal collections.

Example:

```javascript
getPageOrder() {
    return [...this.pageOrder];
}
```

### Destroyed session

After `destroy()`, mutating methods must reject further changes.

---

## 13. Mutation model

All mutations must happen through public methods.

Forbidden:

```javascript
session.activePage = 3;
session.pageOrder.push(4);
session.dirty = true;
```

Required:

```javascript
session.setActivePage(3);
session.setPageOrder([2, 1, 3, 4]);
```

Each successful editing mutation should:

1. validate input
2. update state
3. update `dirty` when appropriate
4. increment `revision`
5. emit or return a change description

---

## 14. Events

Version 1 should use the existing Workspace `EventBus`.

Recommended event:

```javascript
WorkspaceEvents.DOCUMENT_SESSION_CHANGED
```

Recommended payload:

```javascript
{
    documentId: "document-id",
    revision: 4,
    change: {
        type: "active-page",
        value: 2
    }
}
```

Other possible change types:

```text
initialized
active-page
page-order
page-rotation
page-selection
status
error
clean
destroyed
```

The event should be emitted by an orchestration layer or by a session supplied with a narrow event callback.

### Preferred Version 1 approach

Inject a change callback rather than the whole EventBus:

```javascript
new DocumentSession(
    workspaceDocument,
    {
        onChange(change) {
            eventBus.emit(
                WorkspaceEvents.DOCUMENT_SESSION_CHANGED,
                change
            );
        }
    }
);
```

This keeps the domain object independent from the Workspace event implementation.

A simpler constructor without events is acceptable for the first implementation if the Store explicitly emits after each session operation.

---

## 15. Navigation flow

Target page-navigation flow:

```text
Next button
    │
    ▼
PreviewZone / navigation controller
    │
    ▼
DocumentSession.setActivePage(nextPage)
    │
    ▼
DOCUMENT_SESSION_CHANGED
    │
    ▼
PreviewZone
    │
    ▼
PreviewRenderer.renderPage(session)
```

Selection synchronization:

```text
DOCUMENT_SESSION_CHANGED
    │
    ▼
SelectionManager.select({
    type: "page",
    id: session.getActivePage()
})
```

To prevent event loops, orchestration must compare the current value before updating.

---

## 16. Loading flow

Recommended flow when a PDF becomes active:

```text
WorkspaceStore activates document
    │
    ▼
DocumentSession created
    │
    ▼
session.setLoading()
    │
    ▼
PreviewRenderer loads PDF.js document
    │
    ▼
pageCount discovered
    │
    ▼
session.initializePages(pageCount)
    │
    ▼
session status becomes ready
    │
    ▼
page 1 becomes active
```

`initializePages(pageCount)` should create:

```javascript
pageOrder = [1, 2, ..., pageCount]
activePage = pageCount > 0 ? 1 : null
pageRotations = all zero
selectedPageIds = empty
status = "ready"
error = null
dirty = false
```

---

## 17. Dirty-state rules

The following should mark the session dirty:

- changing page order
- rotating a page
- deleting pages
- duplicating pages
- changing annotations
- changing watermark configuration when stored in the session
- changing crop or OCR edits

The following should not mark it dirty:

- changing active page
- selecting pages
- loading PDF metadata
- renderer cache changes
- opening or closing UI panels

This distinction is important for future warnings such as:

> You have unsaved changes.

---

## 18. History and undo/redo

Undo/redo is explicitly deferred.

Version 1 should not introduce a history stack prematurely.

However, all editing mutations should be method-based and produce structured change descriptions. That prepares the system for later commands such as:

```javascript
{
    type: "rotate-page",
    pageId: 2,
    previousRotation: 0,
    nextRotation: 90
}
```

Future history can then store commands without redesigning the entire session API.

---

## 19. Page identity

Version 1 may use original one-based page numbers as identities:

```javascript
1, 2, 3
```

This works for navigation, rotation, deletion, and rearrangement.

When page duplication is integrated, numeric original-page IDs may no longer be enough because two logical pages can reference the same original page.

Future model:

```javascript
{
    id: "page-instance-uuid",
    sourcePage: 2
}
```

Therefore, Version 1 methods should consistently call values `pageId`, not `pageIndex`, even while IDs are numeric.

This preserves room for the future migration.

---

## 20. Proposed minimal Version 1 implementation scope

The first implementation should include only:

- constructor validation
- document access
- page initialization
- active-page state
- page-count state
- status state
- error state
- dirty flag
- revision number
- destruction
- defensive getters

Initial methods:

```javascript
constructor(workspaceDocument, options = {})

getDocument()

getDocumentId()

getStatus()

getError()

getPageCount()

getActivePage()

isDirty()

getRevision()

initializePages(pageCount)

setActivePage(pageId)

setLoading()

setError(error)

markClean()

destroy()
```

Do not add page ordering, rotation, history, or multi-selection until the basic lifecycle passes development tests.

---

## 21. Integration sequence

### Sprint 16.1

Create:

```text
qc-core/src/domain/documentSession.js
```

Add isolated development tests for:

- constructor
- invalid document
- page initialization
- active-page validation
- loading/error states
- revision increments
- destroyed-session behavior

### Sprint 16.2

Add session ownership to `WorkspaceStore`.

Required store API:

```javascript
getDocumentSession(documentId)

getActiveDocumentSession()
```

### Sprint 16.3

Add:

```javascript
WorkspaceEvents.DOCUMENT_SESSION_CHANGED
```

### Sprint 16.4

Connect PDF loading metadata to:

```javascript
session.initializePages(pageCount)
```

### Sprint 16.5

Make `PreviewRenderer` read the active page from the session.

### Sprint 16.6

Connect Previous and Next navigation to:

```javascript
session.setActivePage(...)
```

### Sprint 16.7

Synchronize `SelectionManager` and active page without event loops.

### Sprint 16.8

Remove `PreviewRenderer` as the authoritative owner of `currentPage`.

---

## 22. Final architecture

```text
WorkspaceEngine
    │
    ├── WorkspaceStore
    │       │
    │       ├── WorkspaceDocument
    │       └── DocumentSession
    │
    ├── SelectionManager
    │
    ├── EventBus
    │
    └── WorkspaceLayout
            │
            └── PreviewZone
                    │
                    └── PreviewRenderer
```

State ownership:

```text
WorkspaceDocument
    source file and stable metadata

WorkspaceStore
    workspace-level collections and active document

DocumentSession
    document-specific runtime and editing state

SelectionManager
    generic currently selected Workspace entity

PreviewZone
    orchestration between state and view

PreviewRenderer
    PDF.js loading and visual rendering
```

---

## 23. Decision summary

The accepted architectural direction is:

1. Do not expand `WorkspaceDocument` with runtime state.
2. Introduce one `DocumentSession` per imported document.
3. Keep `SelectionManager` generic and separate.
4. Keep `PreviewZone` as the orchestration boundary.
5. Move authoritative active-page state from `PreviewRenderer` to `DocumentSession`.
6. Keep technical PDF.js render state inside `PreviewRenderer`.
7. Introduce the session incrementally, beginning with lifecycle and active-page state.
8. Delay undo/redo and complex page identities until the basic session architecture is proven.

---

## 24. Status of the current Preview API

The recently introduced:

```javascript
PreviewRenderer.setCurrentPage(pageNumber)
```

may remain temporarily during migration.

It is not the target source of truth.

During the transition it may act as an adapter:

```javascript
setCurrentPage(pageNumber) {
    return this.renderPage(pageNumber);
}
```

After `DocumentSession` integration is complete, navigation state must come from:

```javascript
session.getActivePage()
```

The renderer should then only render the requested session state.

---

**Document version:** 1.0  
**Next implementation step:** `DocumentSession` minimal lifecycle class  
**Code delivery rule:** full-file replacements only
