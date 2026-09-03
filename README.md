# QuiConvert

QuiConvert is a PDF processing platform with a React frontend, a reusable
JavaScript core, a WordPress adapter, and a Flask PDF-processing API.

## Current development baseline

- Branch: `feature/react-migration`
- React migration: Merge PDF connected to the Flask API
- Legacy `qc-core`: preserved as the reference implementation for remaining tools
- WordPress adapter: `qc-dev/`
- Archived WordPress plugin: `frontend-plugin/` (do not use for new development)

## Repository structure

- `frontend-react/` — active React/Vite application
- `qc-core/` — existing reusable PDF workspace engine and tool implementations
- `qc-dev/` — WordPress development adapter for qc-core
- `frontend-plugin/` — archived WordPress plugin
- `docs/` — architecture and project documentation
- `scripts/` — build and packaging scripts

The Flask backend is deployed separately and is not currently stored in this
repository.

## React development

Requirements: Node.js 20 or newer and the QuiConvert Flask backend running at
`http://127.0.0.1:5000`.

```powershell
cd frontend-react
npm install
npm run dev
```

Vite proxies `/api` requests to the local Flask backend. The current migrated
workflow is Merge PDF. Other tools remain disabled until they are migrated and
tested one at a time.

## Verification

```powershell
cd frontend-react
npm run lint
npm run build
```

The root package builds the legacy qc-core library:

```powershell
npm install
npm run build
```

## Repository rules

- Do not commit `node_modules/`, build archives, local backups, `.env` files, or
  editor deployment settings.
- Keep credentials outside Git. In particular, `.vscode/sftp.json` is local-only.
- Make new React work on a feature branch.
- Migrate and test one PDF tool at a time.
- Do not delete `qc-core/` until all required behavior has been migrated.

## Next development package

React Migration R2: migrate Split PDF using the existing Flask endpoint and
retain PDF-or-ZIP download handling.
