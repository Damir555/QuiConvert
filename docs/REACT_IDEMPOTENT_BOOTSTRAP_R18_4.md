# React idempotent WordPress bootstrap R18.4

## Confirmed production cause

The native file input successfully added the first PDF, but the file count
changed from one to zero about 250 milliseconds later. Browser diagnostics
confirmed that the WordPress host element stayed connected while its `.qc-app`
child was replaced. A second React application was therefore mounted into the
same host and started with an empty workspace.

## Fix

- Store the React root instance on its WordPress host element before rendering.
- Skip `createRoot()` when that host already owns a QuiConvert React root.
- Keep the marker non-enumerable and non-writable so unrelated scripts cannot
  accidentally modify it.
- Use React Strict Mode in the Vite development environment only. The embedded
  production build renders one application instance without development-only
  lifecycle repetition.

## Acceptance test

1. Hard-refresh the public WordPress page.
2. Select one PDF immediately after the page becomes interactive.
3. Confirm the file count remains one after at least two seconds.
4. Reset the workspace and repeat ten times.
5. Confirm the same behaviour on the general PDF Tools page and on the
   dedicated Flatten PDF page.
6. Confirm preview, Flatten processing, download, and drag and drop still work.
