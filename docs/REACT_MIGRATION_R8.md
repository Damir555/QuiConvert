# React migration R8: Extract Pages

R8 migrates Extract Pages to the React frontend while preserving the shared PDF.js thumbnail foundation.

## Included

- Enables **Extract Pages** in the React tool list.
- Accepts exactly one PDF file.
- Renders a PDF.js thumbnail for every page.
- Selects and deselects pages with a click.
- Shows the number of selected pages and provides **Clear selection**.
- Allows one, multiple, or all pages to be selected.
- Sends selected page numbers in `pages` to `/api/pdf/extract-pages`.
- Presents the extracted pages as a new PDF download.

## Manual verification

1. Start the Flask backend at `http://127.0.0.1:5000`.
2. Run `npm run lint`, `npm run build`, and `npm run dev` in `frontend-react`.
3. Open `http://localhost:5173/?embed=wordpress`.
4. Select **Extract Pages** and upload a PDF with at least four pages.
5. Select two non-adjacent pages and confirm both cards turn green.
6. Deselect one page and confirm the counter changes.
7. Process and download the result.
8. Confirm the new PDF contains only the selected pages in their original order.
9. Confirm that Merge, Split, Rotate, Compress, Rearrange, Delete, Duplicate, preview, removal, and reset still work.

The proposed next migration step is R9: Reverse Pages.
