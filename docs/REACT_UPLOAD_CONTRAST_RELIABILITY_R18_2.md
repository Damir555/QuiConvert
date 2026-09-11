# React upload contrast and reliability R18.2

## Production symptoms

- The native PDF picker occasionally required a second attempt before the
  selected file appeared in the workspace.
- WordPress or theme button styles could make the selected filename white on a
  pale background.

## Fix

- Open the native file picker from one explicit button handler.
- Prefer the browser's `showPicker()` API and safely fall back to `click()` in
  embedded or older browsers.
- Clear the input immediately before opening it so re-selecting the same PDF
  always produces a fresh change event.
- Copy the selected `FileList` reference before clearing the input.
- Set explicit filename and metadata colours inside the React component scope
  so WordPress and Astra button rules cannot override their contrast.

## Acceptance test

1. Hard-refresh the public WordPress page.
2. Select a PDF through **Add PDF(s)** ten times, removing or resetting it after
   every attempt. Every selection must register on the first attempt.
3. Remove a PDF and immediately select the same file again.
4. Confirm the filename is dark and readable in default and active states.
5. Confirm drag and drop, preview, Flatten PDF, Merge PDF, and download still
   work.
