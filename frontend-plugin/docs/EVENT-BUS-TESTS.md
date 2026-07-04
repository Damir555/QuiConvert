# Event Bus Tests

## EVENT-001
Load test page.
Expected: no Critical Error.

## EVENT-002
Click Choose Files.
Expected: file picker opens.

## EVENT-003
Open browser console.
Expected: SESSION_STARTED event.

## EVENT-004
Select a PDF.
Expected: FILES_SELECTED and STATE_CHANGED events.

## EVENT-005
Run Compress.
Expected: API_REQUEST_STARTED, API_REQUEST_SUCCESS, DOWNLOAD_READY.

## EVENT-006
Regression:
Merge, Split and Compress still work.
