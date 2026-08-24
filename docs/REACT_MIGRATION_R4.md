# React migration R4: Compress PDF

R4 migrates the existing Compress PDF workflow to the React frontend while preserving the R3.1 WordPress embedded presentation.

## Included

- Enables **Compress PDF** in the React tool list.
- Accepts exactly one PDF file.
- Offers Low, Medium, and High quality settings.
- Uses Medium quality by default.
- Sends the file and selected `quality` value to `/api/pdf/compress`.
- Presents the compressed PDF as a browser download.

## Manual verification

1. Start the Flask backend.
2. In `frontend-react`, run `npm run lint` and `npm run build`.
3. Run `npm run dev` and open `http://localhost:5173/?embed=wordpress`.
4. Select **Compress PDF** and upload one PDF.
5. Process and download the same PDF with Low, Medium, and High quality.
6. Confirm that each downloaded file opens correctly.
7. Compare the original and downloaded file sizes.
8. Confirm that Merge, Split, Rotate, preview, file removal, and reset still work.

The proposed next migration step is R5: Rearrange Pages.
