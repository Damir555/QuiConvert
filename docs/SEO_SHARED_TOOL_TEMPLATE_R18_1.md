# Shared SEO Tool Template R18.1

## Purpose

R18.1 replaces the single-purpose Flatten PDF content renderer with one shared,
data-driven WordPress template for all 14 React PDF tools. It does not create,
publish, delete, or edit WordPress pages automatically.

Dedicated SEO pages hide the workspace tool selector. This prevents a visitor
from switching tools while the URL, H1, instructions, and FAQ continue to
describe the original tool. The general `[quiconvert_react]` workspace keeps
the complete tool selector.

## Generic shortcode

```text
[quiconvert_tool_page tool="merge"]
```

Supported values are:

- `merge`
- `split`
- `rotate`
- `compress`
- `flatten`
- `rearrange`
- `delete`
- `duplicate`
- `extract`
- `reverse`
- `page-numbers`
- `protect`
- `unlock`
- `watermark`

The existing `[quiconvert_flatten_pdf]` alias remains supported.

## Heading rule

The SEO template outputs an H1 by default. Configure the WordPress or Elementor
page so it does not output another visible H1.

If the theme page title must remain the only H1, use:

```text
[quiconvert_tool_page tool="flatten" heading="h2"]
```

Every page should have exactly one visible H1 in its public view. The Elementor
editor preview is not the final SEO test.

## Related tools

The template checks WordPress before rendering a related-tool link. A link is
shown only when a published page exists under one of the known slugs. This
prevents links to pages that have not been created yet.

## Elementor compatibility

The React entry script now exits silently when Elementor loads it in a document
that does not contain a QuiConvert React root. This removes the previous
`QuiConvert React root element was not found` console error without changing the
public application behavior.

## Recommended rollout

1. Update the plugin on the private test site.
2. Replace the Flatten page shortcode with
   `[quiconvert_tool_page tool="flatten"]`.
3. Verify one visible H1, React startup, processing, FAQs, and mobile layout.
4. Reuse or create one page at a time for the remaining tools.
5. Configure each final slug, SEO title, meta description, and canonical URL in
   WordPress before publishing or adding it to the sitemap.
