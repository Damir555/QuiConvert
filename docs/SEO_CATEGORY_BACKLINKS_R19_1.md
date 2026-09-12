# SEO Category Backlinks R19.1

## Purpose

R19.1 completes two-way internal linking between individual PDF tool pages and
the R19 category hubs.

Each R18.1 tool page now displays one descriptive category link after its main
content. The link is rendered only when the matching WordPress category page is
published under its recommended slug:

- `organize-pdf`
- `optimize-pdf`
- `secure-pdf`
- `edit-pdf`

Private, draft, missing, or differently named category pages do not produce a
link. Existing tool shortcodes, React processing, FAQ schema, and related-tool
links are unchanged.

## Acceptance test

1. Publish one category page under its recommended slug.
2. Open an individual tool page in that category.
3. Confirm the category link appears and opens the correct page.
4. Return the category page to Private and confirm the link disappears.
5. Verify desktop and mobile layout and repeat for the other categories.
