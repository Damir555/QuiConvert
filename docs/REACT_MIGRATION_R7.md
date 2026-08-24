# React migration R7: Duplicate Pages

R7 migrates Duplicate Pages to the React frontend while preserving the shared PDF.js thumbnail foundation.

## Included

- Enables **Duplicate Pages** in the React tool list.
- Accepts exactly one PDF file.
- Renders a PDF.js thumbnail for every page.
- Selects and deselects pages with a click.
- Shows the number of selected pages and provides **Clear selection**.
- Allows one, multiple, or all pages to be selected.
- Sends selected page numbers in `pages` to `/api/pdf/duplicate-pages`.
- Presents the processed PDF as a browser download.

## Manual verification

1. Start the Flask backend at `http://127.0.0.1:5000`.
2. Run `npm run lint`, `npm run build`, and `npm run dev` in `frontend-react`.
3. Open `http://localhost:5173/?embed=wordpress`.
4. Select **Duplicate Pages** and upload a PDF with at least four pages.
5. Select two non-adjacent pages and confirm both cards turn blue.
6. Deselect one page and confirm the counter changes.
7. Process and download the result.
8. Confirm each selected page has one additional copy and retained pages remain in order.
9. Confirm that Merge, Split, Rotate, Compress, Rearrange, Delete, preview, removal, and reset still work.

The proposed next migration step is R8: Extract Pages.
