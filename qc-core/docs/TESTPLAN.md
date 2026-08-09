# Test Plan

## Sprint 05 / Commit 02 — Capability System Foundation

## Preparation

Copy the supplied complete files into the matching project paths:

- `qc-core/src/shared/toolCapabilities.js`
- `qc-core/src/workspace/workspaceEngine.js`
- `qc-core/dev/capability-test.html`

Run the project through the same local web server used for the other `qc-core/dev` tests. Do not open the HTML test directly through `file://` because browser module imports may be blocked.

## Test 1 — Automated browser test

Open:

`qc-core/dev/capability-test.html`

Expected page output: nine `PASS` lines.

Expected console behavior:

- A table containing the resolved capability profile.
- Two intentionally caught validation errors.
- No uncaught exceptions.

## Test 2 — Existing Workspace development page

Open:

`qc-core/dev/workspace-dev.html`

Expected:

- Workspace initializes normally.
- Toolbar, Upload, Files, Thumbnail, Preview, Tool, and Action zones still initialize.
- Existing state-binding tests continue to work.

In DevTools Console run:

```javascript
qcWorkspace.getCapabilities()
```

Expected default profile:

```javascript
{
    preview: true,
    thumbnails: false,
    multiFile: false,
    pageReorder: false,
    pageSelection: false,
    toolOptions: true,
    processing: true
}
```

## Test 3 — Runtime profile replacement

In the Workspace Console run:

```javascript
qcWorkspace.loadCapability({
    thumbnails: true,
    pageReorder: true
})

qcWorkspace.getCapabilities()
```

Expected:

```javascript
{
    preview: true,
    thumbnails: true,
    multiFile: false,
    pageReorder: true,
    pageSelection: false,
    toolOptions: true,
    processing: true
}
```

## Test 4 — Immutability

Run:

```javascript
Object.isFrozen(
    qcWorkspace.getCapabilities()
)
```

Expected:

```text
true
```

## Test 5 — Unknown key validation

Run:

```javascript
qcWorkspace.loadCapability({
    page_reorder: true
})
```

Expected error:

```text
Unknown tool capabilities: page_reorder
```

## Test 6 — Value validation

Run:

```javascript
qcWorkspace.loadCapability({
    preview: "yes"
})
```

Expected error:

```text
Tool capability "preview" must be a boolean.
```

## Regression criteria

The commit fails verification if any of these occur:

- Workspace cannot initialize without an explicit capability profile.
- Existing state transitions stop working.
- Existing zones fail to initialize.
- A partial profile produces missing keys.
- Unknown keys or non-boolean values are silently accepted.
