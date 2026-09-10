QuiConvert React Tools R18

Shortcode:
[quiconvert_react]

SEO-ready Flatten PDF page:
[quiconvert_flatten_pdf]

The general shortcode also accepts an initial tool, for example:
[quiconvert_react tool="flatten"]

The React assets are loaded only on a singular WordPress page whose content
contains this shortcode. Use a Private page for the first deployment test.

Build the installable plugin ZIP from the repository root:
powershell -ExecutionPolicy Bypass -File .\scripts\build-plugin-zip.ps1

Output:
dist\quiconvert-react-tools.zip

Keep the existing public PDF Tools page unchanged during the R15 test.
