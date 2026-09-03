# React migration R12: Unlock PDF

R12 migrates Unlock PDF to the React frontend.

## Included

- Enables **Unlock PDF** in the React tool list.
- Accepts exactly one password-protected PDF file.
- Requires the current PDF password.
- Does not impose an artificial minimum password length.
- Provides an optional **Show password** control.
- Clears the password when the file, tool, or workspace changes.
- Sends the required `password` field to `/api/pdf/unlock`.
- Presents the unlocked PDF as a browser download.

## Manual verification

1. Start the Flask backend at `http://127.0.0.1:5000`.
2. Run `npm run lint`, `npm run build`, and `npm run dev` in `frontend-react`.
3. Open `http://localhost:5173/?embed=wordpress`.
4. Use the PDF produced by the R11 Protect PDF test.
5. Select **Unlock PDF**, upload the protected PDF, and leave the password empty; confirm processing remains disabled.
6. Enter an incorrect password and confirm the backend returns an understandable error.
7. Enter the correct password, process, and download the result.
8. Confirm the downloaded PDF opens without requesting a password.
9. Switch tools and return to Unlock PDF; confirm the password field is empty.

The proposed next migration step is R13: Watermark PDF.
