# React WordPress loader R15

R15 packages the R14 production build as a WordPress plugin and exposes it through
the new `[quiconvert_react]` shortcode. It does not edit, redirect, or replace the
existing public PDF Tools page.

## Build the plugin ZIP

From PowerShell in the repository root run:

```powershell
cd D:\QuiConvert
powershell -ExecutionPolicy Bypass -File .\scripts\build-plugin-zip.ps1
```

The script runs React lint and build, supplies the production Render API address,
copies the Vite output (including `.vite/manifest.json`) into the plugin and creates:

```text
D:\QuiConvert\dist\quiconvert-react-tools.zip
```

The ZIP contains one top-level `quiconvert-react-tools` directory. The directory
name intentionally matches the ZIP base name so WordPress preserves the complete
plugin structure during installation.

The packaging script uses Windows `tar.exe` to write portable forward-slash ZIP
paths. It then rejects the package if any backslash path is present or if the
plugin bootstrap, React loader or Vite manifest is missing.

An alternate backend can be selected without editing source files:

```powershell
.\scripts\build-plugin-zip.ps1 -ApiBase "https://example.com/api/pdf"
```

`ApiBase` is a public browser URL, never an API key or secret.

## Private WordPress test

1. Back up the WordPress site and database.
2. In WordPress open **Plugins > Add New > Upload Plugin**.
3. Upload `quiconvert-react-tools.zip` and activate **QuiConvert React Tools**.
4. Create a new page named `QuiConvert React Test`.
5. Set the page visibility to **Private**.
6. Add a Shortcode block containing `[quiconvert_react]` and publish it privately.
7. Open the private page while logged in as administrator.

Do not add the shortcode to the public PDF Tools page during R15.

## Acceptance checks

- The normal WordPress header, navigation and footer remain visible.
- The React workspace appears once and does not add a duplicate application header.
- The browser console has no missing manifest, JavaScript or CSS errors.
- PDF preview works.
- At least one page operation and one backend operation return usable downloads.
- A public page without `[quiconvert_react]` does not load React assets.
- The existing public PDF Tools page remains unchanged.

If the loader cannot find a valid production build, administrators see a useful
error instead of a blank workspace. Other visitors see only a generic temporary
unavailable message.
