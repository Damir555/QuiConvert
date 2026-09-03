# React migration R6: Delete Pages

R6 migrates Delete Pages to the React frontend while preserving the WordPress embedded presentation and the R5 thumbnail foundation.

## Included

- Enables **Delete Pages** in the React tool list.
- Accepts exactly one PDF file.
- Renders a PDF.js thumbnail for every page.
- Selects and deselects pages with a click.
- Shows the number of selected pages and provides **Clear selection**.
- Prevents selection of every page so that at least one page remains.
- Sends selected page numbers in `pages` to `/api/pdf/delete-pages`.
- Presents the processed PDF as a browser download.

## Manual verification

1. Start the Flask backend at `http://127.0.0.1:5000`.
2. Run `npm run lint`, `npm run build`, and `npm run dev` in `frontend-react`.
3. Open `http://localhost:5173/?embed=wordpress`.
4. Select **Delete Pages** and upload a PDF with at least four pages.
5. Select two non-adjacent pages and confirm both cards turn red.
6. Deselect one page and confirm the counter changes.
7. Try to select every page and confirm the final page cannot be selected.
8. Process and download the result.
9. Confirm the selected pages are absent and all retained pages remain in order.
10. Confirm that Merge, Split, Rotate, Compress, Rearrange, preview, removal, and reset still work.

The proposed next migration step is R7: Duplicate Pages.
