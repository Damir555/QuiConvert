# React R3.1: WordPress visual integration

R3.1 prepares the React workspace to run inside the existing QuiConvert WordPress page without replacing the WordPress header, navigation, SEO pages, or advertising setup.

## Embedded mode

The standalone Vite application continues to mount on:

```html
<div id="root"></div>
```

The future WordPress shortcode should render:

```html
<div data-quiconvert-react-root></div>
```

The React entry point detects this attribute and enables embedded mode. In that mode it:

- omits the duplicate React top bar;
- uses a WordPress-friendly content width;
- keeps the workspace background transparent;
- scopes form and focus styles to the React root;
- preserves a visible workspace reset control.

## Local preview

Run the Vite development server and open:

```text
http://localhost:5173/?embed=wordpress
```

This previews the embedded workspace without changing the live WordPress site.

## Not included yet

R3.1 does not enqueue the production Vite assets in WordPress and does not replace the public shortcode. That deployment step should be completed and tested on a private WordPress page after the core React tools are migrated.
