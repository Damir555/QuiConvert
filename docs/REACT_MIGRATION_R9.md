# React migration R9: Reverse Pages

R9 migrates Reverse Pages to the React frontend.

## Included

- Enables **Reverse Pages** in the React tool list.
- Accepts exactly one PDF file.
- Clearly explains that the complete document order will be reversed.
- Sends the PDF to `/api/pdf/reverse-pages` without unnecessary options.
- Presents the reversed PDF as a browser download.

## Manual verification

1. Start the Flask backend at `http://127.0.0.1:5000`.
2. Run `npm run lint`, `npm run build`, and `npm run dev` in `frontend-react`.
3. Open `http://localhost:5173/?embed=wordpress`.
4. Select **Reverse Pages** and upload a PDF with at least four visibly different pages.
5. Process and download the result.
6. Confirm the last original page is first, the first original page is last, and every page appears once.
7. Confirm that the previously migrated tools, preview, removal, and reset still work.

The proposed next migration step is R10: Page Numbers.
