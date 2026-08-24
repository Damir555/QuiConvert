# React migration R11: Protect PDF

R11 migrates Protect PDF to the React frontend.

## Included

- Enables **Protect PDF** in the React tool list.
- Accepts exactly one PDF file.
- Requires a password containing at least four characters.
- Requires a matching password confirmation in the browser.
- Provides an optional **Show password** control.
- Clears password fields when the file, tool, or workspace changes.
- Sends only the required `password` field to `/api/pdf/protect`.
- Presents the protected PDF as a browser download.

## Manual verification

1. Start the Flask backend at `http://127.0.0.1:5000`.
2. Run `npm run lint`, `npm run build`, and `npm run dev` in `frontend-react`.
3. Open `http://localhost:5173/?embed=wordpress`.
4. Select **Protect PDF** and upload one PDF.
5. Confirm the process button remains disabled for fewer than four characters.
6. Enter mismatching passwords and confirm the mismatch message appears.
7. Enter matching passwords, process, and download the result.
8. Confirm a PDF reader requires the chosen password and opens the document after the correct password is entered.
9. Switch tools and return to Protect PDF; confirm both password fields are empty.

The proposed next migration step is R12: Unlock PDF.
