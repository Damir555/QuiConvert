# SEO Tools Directory R20.1

## Purpose

R20.1 adds a crawlable directory below the main PDF workspace. It connects the
PDF Tools page to the four category hubs and selected popular tools without
changing React processing or any existing tool shortcode.

## Shortcode

Add this shortcode below the existing workspace shortcode on the PDF Tools
page:

```text
[quiconvert_tools_directory]
```

The directory heading is an H2 by default because the React workspace already
provides the page H1. For a standalone directory page, use:

```text
[quiconvert_tools_directory heading="h1"]
```

## Output

- Browse by category cards for Organize, Optimize, Secure, and Edit PDF.
- Live counts based on published individual tool pages.
- Quick-access links to selected popular PDF tools.
- Responsive four-, two-, and one-column layouts.
- Server-rendered internal links and ItemList structured data.

Only published category and tool pages are linked. Draft, private, missing, or
unsupported slugs remain hidden.

## WordPress rollout

1. Replace the plugin with the R20.1 production ZIP.
2. Open the existing PDF Tools page in Elementor.
3. Keep the existing `[quiconvert_react]` shortcode unchanged.
4. Add a second Shortcode widget beneath it with
   `[quiconvert_tools_directory]`.
5. Update the page and clear WordPress, hosting, and browser caches.
6. Confirm all four category links, popular-tool links, desktop layout, and
   mobile stacking.
7. Confirm the page still contains one H1.
