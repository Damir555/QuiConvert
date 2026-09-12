# SEO Category Hubs R19

## Purpose

R19 adds useful category landing pages between the main PDF Tools page and the
individual R18.1 tool pages. Category cards use crawlable WordPress permalinks
and appear only when the matching tool page is published.

## Shortcode

```text
[quiconvert_category_page category="organize"]
```

Supported categories:

- `organize`: Merge, Split, Rearrange, Delete, Duplicate, Extract, Reverse
- `optimize`: Compress, Flatten
- `secure`: Protect, Unlock, Watermark
- `edit`: Rotate, Page Numbers

The shortcode outputs an H1 by default. Use `heading="h2"` only when the theme
provides the page's single visible H1.

## Recommended slugs

- `organize-pdf`
- `optimize-pdf`
- `secure-pdf`
- `edit-pdf`

## Rollout

1. Create each WordPress category page as Private.
2. Add its category shortcode and hide the duplicate theme page title.
3. Confirm one visible H1, published tool links, FAQ content, and mobile layout.
4. Publish the page and add it to the PDF Tools navigation.
5. Link each individual tool page back to its category in a later controlled
   enhancement.

R19 does not create, publish, delete, or edit WordPress pages automatically.
