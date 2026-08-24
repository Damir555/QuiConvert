# React migration R10: Page Numbers

R10 migrates the existing Page Numbers workflow to the React frontend.

## Included

- Enables **Page Numbers** in the React tool list.
- Accepts exactly one PDF file.
- Clearly explains that sequential numbering is applied to every page.
- Sends the PDF to `/api/pdf/page-numbers` without unsupported options.
- Presents the numbered PDF as a browser download.

The current backend contract does not expose position, starting number, font size, or style parameters. Those controls should only be added after backend support exists and is tested.

## Manual verification

1. Start the Flask backend at `http://127.0.0.1:5000`.
2. Run `npm run lint`, `npm run build`, and `npm run dev` in `frontend-react`.
3. Open `http://localhost:5173/?embed=wordpress`.
4. Select **Page Numbers** and upload a PDF with at least four pages.
5. Process and download the result.
6. Confirm every page has a sequential page number and all original content remains present.
7. Confirm that the previously migrated tools, preview, removal, and reset still work.

The proposed next migration step is R11: Protect PDF.
