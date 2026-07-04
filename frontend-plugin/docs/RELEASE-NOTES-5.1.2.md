# QuiConvert Plugin 5.1.2

## Added
- CORE-006 State Engine.
- `state.js` module with get, set, is, subscribe, unsubscribe and reset.
- Legal state transitions.
- UI locking during validation/upload/processing.
- Basic protection against double-click duplicate processing.

## Changed
- Uploader now uses State Engine.
- UI state is reflected through `data-state`.

## Regression Scope
- Merge
- Split
- Compress
- Drag & Drop
- Choose Files
- Notification Engine
