# React native file input R18.3

## Production symptom

The Windows file dialog opened and allowed a PDF to be selected, but on some
first attempts the dialog closed while the React workspace remained at zero
files. The production page loaded the current R18.2 assets and reported no
application error, so caching and backend processing were excluded.

## Fix

- Place the real file input directly over the visible **Add PDF(s)** control.
- Let the user's pointer activate the browser's native input without
  `showPicker()`, a programmatic `click()`, or delegated label activation.
- Handle the native `input` event and immediately copy `FileList` into a plain
  array before resetting the input value.
- Preserve keyboard focus indication, PDF filtering, single/multiple-file
  behaviour, drag and drop, and all downstream processing.

## Acceptance test

1. Hard-refresh the public WordPress page.
2. Select a PDF through **Add PDF** ten times, resetting the workspace after
   every attempt. Every selection must appear immediately.
3. Remove a PDF and select the same file again.
4. Confirm keyboard activation works and focus is visible.
5. Confirm drag and drop, preview, Flatten PDF processing, and download remain
   functional.
