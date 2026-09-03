# React migration R5: Rearrange Pages

R5 migrates Rearrange Pages to the React frontend while preserving the R3.1 WordPress embedded presentation.

## Included

- Enables **Rearrange Pages** in the React tool list.
- Accepts exactly one PDF file.
- Renders a PDF.js thumbnail for every page.
- Supports drag-and-drop page ordering.
- Provides accessible left and right movement buttons.
- Sends every original page exactly once in `page_order` to `/api/pdf/rearrange`.
- Presents the rearranged PDF as a browser download.

## Manual verification

1. Start the Flask backend at `http://127.0.0.1:5000`.
2. Run `npm run lint`, `npm run build`, and `npm run dev` in `frontend-react`.
3. Open `http://localhost:5173/?embed=wordpress`.
4. Select **Rearrange Pages** and upload a PDF with at least four pages.
5. Move pages with the arrow controls and confirm position labels change.
6. Move another page with drag-and-drop.
7. Process and download the result.
8. Confirm that the downloaded PDF contains every page once in the chosen order.
9. Confirm that Merge, Split, Rotate, Compress, preview, removal, and reset still work.

The proposed next migration step is R6: Delete Pages.
