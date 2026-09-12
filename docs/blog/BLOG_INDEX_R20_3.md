# Blog Index R20.3

## Purpose

R20.3 adds a server-rendered WordPress blog index that visually matches the
QuiConvert category hubs. It lists published posts with a featured image or a
branded fallback, category, publication date, excerpt, and a descriptive link.

## WordPress setup

WordPress ignores normal page content when a page is assigned as the automatic
Posts page. Before adding the new shortcode:

1. Open **Settings > Reading**.
2. Keep the existing static homepage selection.
3. Set **Posts page** to **— Select —** and save the settings.
4. Open the existing WordPress page whose slug is `blog`.
5. Hide the theme page title if it would create a second visible H1.
6. Add a Shortcode widget or block containing:

   `[quiconvert_blog_index]`

7. Publish or update the page and clear the WordPress and hosting caches.

The public address remains `/blog/`. Existing posts and their URLs are not
changed by this setup.

## Shortcode options

- `[quiconvert_blog_index]` renders an H1 and up to nine posts per page.
- `[quiconvert_blog_index heading="h2"]` is available only when the surrounding
  page template already supplies the single H1.
- `[quiconvert_blog_index posts_per_page="12"]` changes the page size. Values are
  limited to the range from 1 to 24.

## Publishing behavior

- Only published WordPress posts appear.
- The newest post is presented as the featured card.
- A WordPress featured image is used when available.
- Posts without a featured image receive a branded document illustration.
- The first assigned category, publication date, title, excerpt, and permalink
  are read from WordPress.
- Pagination appears automatically when more posts exist than the selected page
  size.
- ItemList structured data is included for the posts displayed on the page.

## Verification

1. Confirm that `/blog/` displays one H1: `Practical PDF Guides`.
2. Confirm that every article title and **Read guide** link opens the intended
   post.
3. Confirm that the category link opens the WordPress category archive.
4. Test desktop, tablet, and mobile layouts.
5. Add or replace a featured image on one post and confirm that its card updates.
6. View the page while logged out and after clearing caches.
