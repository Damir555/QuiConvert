# React production stabilization R14

R14 prepares the React PDF workspace for production integration without changing
the current public WordPress page.

## Changes

- PDF.js is loaded only when a PDF preview or page editor needs it. This keeps the
  initial application bundle smaller while preserving the existing PDF worker.
- The backend address can be configured with `VITE_PDF_API_BASE`. Local development
  still uses `/api/pdf` and the existing Vite proxy.
- Every backend request includes a persistent `x-session-id` header for server-side
  request tracking and rate limiting.
- Vite uses relative asset paths and creates `.vite/manifest.json`, which a future
  WordPress loader can use to enqueue the current hashed JavaScript and CSS files.

No API keys or other secrets belong in a `VITE_` variable because Vite exposes
these values to the browser.

## Local verification

Start the Flask backend in one terminal. In a second PowerShell terminal run:

```powershell
cd D:\QuiConvert\frontend-react
npm run lint
npm run build
npm run dev
```

Open `http://localhost:5173/?embed=wordpress` and verify:

1. a PDF preview appears after upload;
2. Merge, Split, Rotate and Compress return usable files;
3. Rearrange, Delete, Duplicate, Extract and Reverse preserve the expected pages;
4. Page Numbers, Protect, Unlock and Watermark return usable PDFs;
5. DevTools Network shows `x-session-id` on requests to `/api/pdf/...`.

After the build, `frontend-react/dist/.vite/manifest.json` must exist. The build
should also report the PDF.js code as a separate JavaScript chunk rather than part
of the initial `index` chunk.

## Production configuration

Copy `.env.production.example` to `.env.production` and confirm the backend URL
before creating the deployment build. The example contains no secret.

R15 can use the generated manifest to package and load the React application on a
private WordPress test page before the public PDF Tools page is replaced.
