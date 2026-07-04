# State Engine Tests

## STATE-001
Initial page load state should be IDLE.

## STATE-002
Selecting files should transition to FILES_SELECTED.

## STATE-003
Clicking a tool should transition through VALIDATING → UPLOADING → PROCESSING → READY.

## STATE-004
During processing, buttons and inputs should be disabled.

## STATE-005
Double-clicking a tool button should not start two jobs.

## STATE-006
Validation error should transition to ERROR, then recover to FILES_SELECTED or IDLE.

## STATE-007
Existing Merge/Split/Compress functionality must continue to work.
