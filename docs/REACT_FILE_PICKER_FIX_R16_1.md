# React file picker reliability R16.1

## Production symptom

On the public Elementor page, choosing PDFs through **Add PDFs** sometimes did
not add the first selection. Repeating the same action usually worked. Native
drag and drop worked on the first attempt, which isolated the issue to the
programmatic click used to open the hidden file input.

## Fix

- Associate the visible control with the hidden file input through `htmlFor`.
- Let the browser perform the native label-to-input activation.
- Clear the input value before each picker opens so selecting the same file
  again always produces a new selection event.
- Keep drag-and-drop and downstream file processing unchanged.

## Acceptance test

1. Hard-refresh the public page.
2. Use **Add PDFs** ten times after removing or resetting the selected file(s).
3. Confirm every selection appears in the workspace on the first attempt.
4. Re-select the same PDF after removing it and confirm it is added immediately.
5. Confirm drag and drop, preview, Merge and Rearrange still work.
