QuiConvert React Tools R18.1

Shortcode:
[quiconvert_react]

SEO-ready Flatten PDF page:
[quiconvert_flatten_pdf]
[quiconvert_category_page category="organize"]

SEO-ready page for any supported tool:
[quiconvert_tool_page tool="merge"]

Supported tool values:
merge, split, rotate, compress, flatten, rearrange, delete, duplicate,
extract, reverse, page-numbers, protect, unlock, watermark

The SEO shortcode renders an H1 by default. If the WordPress theme already
renders the visible page title as the only H1, use:
[quiconvert_tool_page tool="merge" heading="h2"]

The general shortcode also accepts an initial tool, for example:
[quiconvert_react tool="flatten"]

SEO category values are organize, optimize, secure, and edit. Category cards
link only to matching tool pages that are currently published in WordPress.

Published posts in the PDF Guides category automatically receive the shared
QuiConvert guide layout and related-tool links. No article shortcode is needed.

The React workspace assets are loaded only on a singular WordPress page whose
content contains a QuiConvert shortcode. PDF Guides posts load the shared CSS
without loading the React application script. Use a Private page for the first
deployment test.

Build the installable plugin ZIP from the repository root:
powershell -ExecutionPolicy Bypass -File .\scripts\build-plugin-zip.ps1

Output:
dist\quiconvert-react-tools.zip

Keep the existing public PDF Tools page unchanged during the R15 test.
