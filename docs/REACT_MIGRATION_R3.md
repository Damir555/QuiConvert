# React migration R3: Rotate PDF

R3 migrates the existing Rotate PDF workflow to the React frontend.

## Included

- Enables **Rotate PDF** in the React tool list.
- Accepts exactly one PDF file.
- Offers 90°, 180°, and 270° clockwise rotation.
- Sends the file and selected `rotation` value to `/api/pdf/rotate`.
- Presents the processed PDF as a browser download.

## Manual verification

1. Start the Flask backend.
2. In `frontend-react`, run `npm run dev`.
3. Select **Rotate PDF** and upload a multi-page PDF.
4. Test 90°, 180°, and 270° separately.
5. Download each result and confirm every page has the selected orientation.
6. Remove the file, upload another PDF, and confirm the preview and controls recover normally.
7. Run `npm run lint` and `npm run build`.

The proposed next migration step is R4: Compress PDF.
