# SEO Category Design R19.2

## Purpose

R19.2 gives the four PDF category hubs a shared visual hierarchy while keeping
the R19 shortcode, published-page lookup, slugs, internal links, and FAQ schema
behavior unchanged.

## Visual structure

- Prominent category hero with one H1 and a lightweight document illustration.
- Published-tool count and a clear "Choose a PDF task" section heading.
- Consistent inline SVG icon for every tool card.
- Three-column desktop grid, two-column tablet grid, and one-column mobile grid.
- Task guide and FAQ panels below the tool links.

## Existing shortcodes

No WordPress shortcode changes are required:

```text
[quiconvert_category_page category="organize"]
[quiconvert_category_page category="optimize"]
[quiconvert_category_page category="secure"]
[quiconvert_category_page category="edit"]
```

The optional `heading="h2"` attribute remains available when the WordPress
theme already provides the page H1.

## Production check

1. Replace the plugin ZIP and clear WordPress, HostGator, and browser caches.
2. Open Organize PDF and confirm that all seven published tool cards appear.
3. Test every card link and the FAQ accordions.
4. Check tablet and mobile layouts.
5. Confirm that the page contains only one visible H1.
6. Repeat the visual and link checks on Optimize, Secure, and Edit PDF.
