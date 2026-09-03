# Sprint 01 — Workspace Template Foundation

## Objective

Create a reusable product-page template that renders content from a schema and provides a mount point for the existing Workspace application.

## New files

- `src/templates/workspaceTemplate.js`
- `src/schemas/mergeWorkspaceSchema.js`
- `src/components/siteHeader.js`
- `src/components/breadcrumb.js`
- `src/components/toolHero.js`
- `src/components/relatedTools.js`
- `src/components/faqSection.js`
- `src/components/trustSection.js`
- `src/components/siteFooter.js`
- `styles/workspace-shell.css`
- `dev/workspace-template-dev.html`

## Integration rule

The template owns page composition. The Workspace application still owns upload, document state, zones, processing and results.

The integration is deliberately narrow:

1. Render template.
2. Ask template for its Workspace mount element.
3. Create the existing Workspace application inside that element.
4. Pass the template schema's Workspace configuration to the application.

## Engine changes

None.

## Acceptance criteria

- The new development page renders header, breadcrumb, hero, workspace, related tools, FAQ, trust and footer.
- The Workspace application initializes inside the shell.
- Merge upload and processing behaviour remains owned by the existing engine.
- The browser console shows the application and all registered zones.
- No existing source file is replaced by this package.

## Test procedure

1. Start the backend on `http://127.0.0.1:5000`.
2. Serve `qc-core` through a local HTTP server.
3. Open `dev/workspace-template-dev.html`.
4. Confirm the product shell is visible.
5. Confirm the Workspace is visible inside the large white stage card.
6. Upload at least two PDF files.
7. Confirm the upload status reflects the document count.
8. Click `Process PDF`.
9. Confirm the result area shows processing and then a download.
10. Confirm there are no uncaught console errors.
