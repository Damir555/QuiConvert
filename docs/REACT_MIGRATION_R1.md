# React Migration R1 — Repository Stabilization

Date: 2026-08-20

## Scope

- Preserve `feature/react-migration` as the functional migration baseline.
- Add cross-platform line-ending rules.
- Stop tracking generated JavaScript dependencies.
- Ignore local secrets, experiments, and safety copies.
- Replace the obsolete repository README with the current architecture and
  local verification workflow.

## Decisions

- `frontend-react/` is the active user-interface implementation.
- `qc-core/` remains the reference implementation during incremental migration.
- `qc-dev/` remains the WordPress adapter.
- `frontend-plugin/` is archived and should not receive new application logic.
- `devkit/` and `qc-core-backup/` remain local-only until separately reviewed.
- The Flask backend remains a separately deployed project for now.

## Security

- `.vscode/` and `.env*` are excluded from Git.
- SFTP credentials must remain outside version control.
- If a project archive containing `.vscode/sftp.json` is shared, rotate the
  associated SFTP password.

## Verification checklist

Run on Windows from the repository root:

```powershell
git status
cd frontend-react
npm install
npm run lint
npm run build
```

For an end-to-end Merge PDF test, start the Flask backend at
`http://127.0.0.1:5000`, run `npm run dev`, upload two PDFs, process them, and
download the merged result.

## Next package

R2 migrates Split PDF to React while supporting both PDF and ZIP responses.
