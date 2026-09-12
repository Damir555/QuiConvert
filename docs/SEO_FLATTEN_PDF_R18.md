# SEO Flatten PDF R18

## Purpose

R18 provides an SEO-ready WordPress shortcode for the first dedicated tool
page. It does not modify or publish any WordPress page automatically.

## Shortcode

Create a new private WordPress page and add:

```text
[quiconvert_flatten_pdf]
```

The shortcode renders:

- an English introduction to the tool;
- the React workspace with Flatten PDF selected initially;
- three-step usage instructions;
- guidance on when flattening is appropriate;
- a warning to retain the editable original;
- visible FAQs and matching FAQPage structured data;
- a Privacy Policy link when WordPress has a privacy page configured.

The existing `[quiconvert_react]` shortcode remains supported. It also accepts
an optional initial tool, such as `[quiconvert_react tool="flatten"]`.

## WordPress page settings

Recommended page title: `Flatten PDF Online`

Recommended slug: `flatten-pdf`

Suggested SEO title: `Flatten PDF Online – Make Forms and Annotations Permanent`

Suggested meta description: `Flatten PDF forms and annotations into fixed page content online. Upload one PDF, process it, and download the flattened copy.`

Keep the page private during validation. Do not place it in the public menu or
sitemap until the visual, functional, mobile, canonical, and indexing checks
have passed.

## Validation

1. Confirm that Flatten PDF is selected on the first page load.
2. Process a PDF containing a form field or annotation.
3. Confirm that the downloaded file is visually correct and no longer editable.
4. Disable JavaScript temporarily and confirm that the explanatory content is
   still present in the page source.
5. Test desktop and mobile layouts.
6. Confirm that the page has one theme-generated H1 and no duplicate H1.
7. Confirm that the canonical URL points to the final page URL.
8. Validate the structured data before making the page public.
