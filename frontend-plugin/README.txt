QuiConvert React Tools R15

Shortcode:
[quiconvert_react]

The React assets are loaded only on a singular WordPress page whose content
contains this shortcode. Use a Private page for the first deployment test.

Build the installable plugin ZIP from the repository root:
powershell -ExecutionPolicy Bypass -File .\scripts\build-plugin-zip.ps1

Output:
dist\quiconvert-react-tools-r15.zip

Keep the existing public PDF Tools page unchanged during the R15 test.
