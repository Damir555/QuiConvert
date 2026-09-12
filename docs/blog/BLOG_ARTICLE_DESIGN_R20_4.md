# Blog Article Design R20.4

## Purpose

R20.4 gives individual QuiConvert PDF guides a consistent, readable article
layout and connects each guide back to the blog index and relevant PDF tools.

## Publishing behavior

- The layout applies automatically to singular WordPress posts assigned to the
  `PDF Guides` category (`pdf-guides`).
- No shortcode or content migration is required.
- Other WordPress posts and pages are unchanged.
- Guide pages load the shared QuiConvert stylesheet without loading the React
  PDF workspace JavaScript.
- The existing WordPress post title remains the only H1.
- The plugin adds an **All PDF guides** link when a published `/blog/` page is
  available.
- Related-tool cards appear only for matching published QuiConvert pages.

## WordPress verification

1. Install the current plugin package and clear WordPress and hosting caches.
2. Open a published post in the `PDF Guides` category while logged out.
3. Confirm the body has a readable centered width, styled headings, lists, and
   links.
4. Confirm **All PDF guides** opens `/blog/`.
5. Confirm every displayed related-tool card opens the intended published page.
6. Confirm the browser loads the QuiConvert stylesheet but does not load the
   React application script on the article.
7. Check desktop and mobile layouts and confirm there is only one visible H1.
