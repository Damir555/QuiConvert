# React migration R13: Watermark PDF

R13 migrates Watermark PDF to the React frontend using the existing backend contract.

## Included

- Enables **Watermark PDF** in the React tool list.
- Accepts exactly one PDF file.
- Requires non-empty watermark text.
- Supports Gray, Black, and Red colors.
- Supports Small, Medium, and Large font sizes.
- Supports opacity from 10% through 100% in 5% increments.
- Uses the existing defaults: Gray, Large, and 25% opacity.
- Clears watermark settings when the file, tool, or workspace changes.
- Sends `text`, `color`, `size`, and `opacity` to `/api/pdf/watermark`.
- Presents the watermarked PDF as a browser download.

## Manual verification

1. Start the Flask backend at `http://127.0.0.1:5000`.
2. Run `npm run lint`, `npm run build`, and `npm run dev` in `frontend-react`.
3. Open `http://localhost:5173/?embed=wordpress`.
4. Select **Watermark PDF** and upload one PDF.
5. Confirm processing remains disabled while the text field is empty.
6. Process one result with the default Gray, Large, 25% settings.
7. Process another result with Red, Small, and a visibly different opacity.
8. Confirm every page contains the selected text and the visual settings differ as expected.
9. Switch tools and return to Watermark PDF; confirm the defaults are restored and text is empty.

The proposed next step is a React migration stabilization and production-integration review.
