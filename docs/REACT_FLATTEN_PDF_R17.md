# React Flatten PDF R17

## Scope

R17 adds the Flatten PDF tool to the React workspace and connects it to the
Flask `POST /api/pdf/flatten` endpoint.

The tool accepts exactly one PDF. Visible form values and annotations become
permanent page content, while interactive widgets and annotations are removed.
The normal PDF page content is not rasterized. Password-protected PDFs must be
unlocked before flattening.

## Functional test

1. Open a PDF form and enter recognizable values.
2. Add a visible annotation if the PDF editor supports it.
3. Upload the saved PDF to Flatten PDF.
4. Process and download `flattened.pdf`.
5. Confirm the entered values and visible annotation remain visible.
6. Confirm form fields and annotations can no longer be edited.
7. Confirm text that was ordinary PDF content remains selectable/searchable.
8. Confirm page count, page sizes, and orientation are unchanged.

## Regression test

- Run `npm run lint` and `npm run build`.
- Confirm Merge PDF still accepts multiple files.
- Confirm another single-file tool still replaces the previous selected file.
- Build the WordPress ZIP and confirm the Vite manifest is packaged.
