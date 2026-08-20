# React Migration R2 — Split PDF

Date: 2026-08-20

## Scope

- Enable Split PDF in the React tool list.
- Require exactly one PDF for Split.
- Support splitting every page and entering page ranges.
- Send the existing `split_pages` field to `/api/pdf/split`.
- Preserve backend filenames and support PDF or ZIP downloads.
- Share request, error, blob, and filename handling with Merge PDF.

## Accepted page-range format

Positive page numbers and ascending ranges separated by commas:

```text
1-3,5,8-10
```

Blank `split_pages` means split every page.

## Manual verification

1. Start the Flask backend at `http://127.0.0.1:5000`.
2. In `frontend-react/`, run `npm install` and `npm run dev`.
3. Confirm Merge still accepts two or more PDFs.
4. Select Split PDF and confirm only one PDF is retained when files are added.
5. Process with **Split every page** and download the ZIP result.
6. Process with a range such as `1-2,4` and download the returned result.
7. Confirm invalid ranges such as `0`, `3-1`, or `1,,2` cannot be processed.
8. Run `npm run lint` and `npm run build`.

## Next package

R3 migrates Rotate PDF and introduces the first reusable single-file tool
settings pattern.
