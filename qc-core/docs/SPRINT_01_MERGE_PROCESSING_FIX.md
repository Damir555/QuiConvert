# Sprint 01 — Merge Processing Integration Fix

## Problem

The Workspace UI stored uploaded files in `WorkspaceStore`, while the legacy `mergeTool` read from `engine/fileState.js`. As a result, the file list showed uploaded PDFs, but Merge received an empty legacy file array.

## Resolution

- `WorkspaceProcessor.buildToolOptions()` now exposes all Workspace documents and their underlying `File` objects as `documents` and `files`.
- `mergeTool` now uses `options.files` supplied by the Workspace pipeline.
- A legacy `getFiles()` fallback remains for older entry points.

## Thumbnail behavior

Merge intentionally has `preview: false` and `thumbnails: false` in `config/toolDefinitions.js`. Page thumbnails are not required for merging. The file list is the current Merge ordering surface.

## Acceptance criteria

1. Upload two or more PDFs in `dev/workspace-template-dev.html`.
2. The file counter and file cards show all PDFs.
3. Click **Process PDF**.
4. No “Please select at least one PDF file” error appears.
5. The backend receives all uploaded PDFs and the Result zone shows a download.
