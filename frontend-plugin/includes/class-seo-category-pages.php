<?php

if (!defined('ABSPATH')) {
    exit;
}

class QuiConvert_SEO_Category_Pages_R19 {
    const SHORTCODE = 'quiconvert_category_page';
    const DIRECTORY_SHORTCODE = 'quiconvert_tools_directory';

    public function init() {
        add_shortcode(self::SHORTCODE, array($this, 'render_shortcode'));
        add_shortcode(self::DIRECTORY_SHORTCODE, array($this, 'render_directory_shortcode'));
    }

    public function render_shortcode($atts = array()) {
        $atts = shortcode_atts(array('category' => 'organize', 'heading' => 'h1'), $atts, self::SHORTCODE);
        $categories = $this->get_categories();
        $category_id = sanitize_key($atts['category']);

        if (!isset($categories[$category_id])) {
            return current_user_can('manage_options')
                ? '<div class="quiconvert-react-error">' . esc_html__('Unknown QuiConvert category.', 'quiconvert-tools') . '</div>'
                : '';
        }

        $category = $categories[$category_id];
        $heading_tag = strtolower($atts['heading']) === 'h2' ? 'h2' : 'h1';
        $cards = '';

        foreach ($category['tools'] as $tool) {
            $url = $this->find_published_page_url($tool['slugs']);
            if (!$url) {
                continue;
            }

            $cards .= sprintf(
                '<article class="qc-category-card"><div class="qc-category-card__icon" aria-hidden="true">%5$s</div><h2><a href="%1$s">%2$s</a></h2><p>%3$s</p><a class="qc-category-card__link" href="%1$s">%4$s <span aria-hidden="true">&rarr;</span></a></article>',
                esc_url($url),
                esc_html($tool['title']),
                esc_html($tool['description']),
                esc_html($tool['link_text']),
                $this->get_icon_svg($tool['icon'])
            );
        }

        if (!$cards && current_user_can('manage_options')) {
            $cards = '<p class="quiconvert-react-error">' . esc_html__('Publish the individual tool pages to display category links.', 'quiconvert-tools') . '</p>';
        }

        $faq = '';
        $schema_entities = array();
        foreach ($category['faq'] as $item) {
            $faq .= '<details class="qc-seo-faq"><summary>' . esc_html($item[0]) . '</summary><p>' . esc_html($item[1]) . '</p></details>';
            $schema_entities[] = array('@type' => 'Question', 'name' => $item[0], 'acceptedAnswer' => array('@type' => 'Answer', 'text' => $item[1]));
        }

        $schema = array('@context' => 'https://schema.org', '@type' => 'FAQPage', 'mainEntity' => $schema_entities);
        $tool_count = substr_count($cards, '<article');
        $tool_count_label = sprintf(
            _n('%s published tool', '%s published tools', $tool_count, 'quiconvert-tools'),
            number_format_i18n($tool_count)
        );

        return sprintf(
            '<section class="qc-category-page qc-category-page--%1$s" aria-labelledby="qc-category-%1$s-heading"><header class="qc-category-hero"><div class="qc-category-hero__copy"><p class="qc-seo-eyebrow">%2$s</p><%3$s id="qc-category-%1$s-heading">%4$s</%3$s><p>%5$s</p></div><div class="qc-category-hero__art" aria-hidden="true"><span>%12$s</span><span>%13$s</span></div></header><div class="qc-category-heading"><h2>%14$s</h2><p>%15$s</p></div><div class="qc-category-grid">%6$s</div><div class="qc-category-guide"><section class="qc-category-guide__intro"><span class="qc-category-guide__icon" aria-hidden="true">%16$s</span><div><h2>%7$s</h2><p>%8$s</p></div></section><section class="qc-category-guide__faq"><h2>%9$s</h2>%10$s</section></div><script type="application/ld+json">%11$s</script></section>',
            esc_attr($category_id),
            esc_html__('PDF TOOL COLLECTION', 'quiconvert-tools'),
            $heading_tag,
            esc_html($category['title']),
            esc_html($category['intro']),
            $cards,
            esc_html($category['guide_title']),
            esc_html($category['guide']),
            esc_html__('Frequently asked questions', 'quiconvert-tools'),
            $faq,
            wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP),
            $this->get_icon_svg('files'),
            $this->get_icon_svg($category['icon']),
            esc_html__('Choose a PDF task', 'quiconvert-tools'),
            esc_html($tool_count_label),
            $this->get_icon_svg('help-circle')
        );
    }

    public function render_directory_shortcode($atts = array()) {
        $atts = shortcode_atts(array('heading' => 'h2'), $atts, self::DIRECTORY_SHORTCODE);
        $heading_tag = strtolower($atts['heading']) === 'h1' ? 'h1' : 'h2';
        $categories = $this->get_categories();
        $directory_categories = array(
            'organize' => array(
                'slugs' => array('organize-pdf'),
                'title' => 'Organize PDF',
                'description' => 'Combine files or rearrange, extract, duplicate, reverse, and remove PDF pages.',
                'link_text' => 'Browse organization tools',
            ),
            'optimize' => array(
                'slugs' => array('optimize-pdf'),
                'title' => 'Optimize PDF',
                'description' => 'Reduce file size or turn interactive content into fixed PDF pages.',
                'link_text' => 'Browse optimization tools',
            ),
            'secure' => array(
                'slugs' => array('secure-pdf'),
                'title' => 'Secure PDF',
                'description' => 'Protect, unlock, or visibly watermark PDF documents before sharing.',
                'link_text' => 'Browse security tools',
            ),
            'edit' => array(
                'slugs' => array('edit-pdf'),
                'title' => 'Edit PDF',
                'description' => 'Correct page orientation and add clear, consistent page numbers.',
                'link_text' => 'Browse editing tools',
            ),
        );
        $category_cards = '';
        $schema_items = array();
        $position = 1;

        foreach ($directory_categories as $category_id => $directory_category) {
            $url = $this->find_published_page_url($directory_category['slugs']);
            if (!$url || !isset($categories[$category_id])) {
                continue;
            }

            $published_count = $this->count_published_tools($categories[$category_id]['tools']);
            $count_label = sprintf(
                _n('%s available tool', '%s available tools', $published_count, 'quiconvert-tools'),
                number_format_i18n($published_count)
            );
            $category_cards .= sprintf(
                '<article class="qc-directory-category qc-directory-category--%1$s"><div class="qc-directory-category__icon" aria-hidden="true">%2$s</div><p class="qc-directory-category__count">%3$s</p><h3><a href="%4$s">%5$s</a></h3><p>%6$s</p><a class="qc-directory-category__link" href="%4$s">%7$s <span aria-hidden="true">&rarr;</span></a></article>',
                esc_attr($category_id),
                $this->get_icon_svg($categories[$category_id]['icon']),
                esc_html($count_label),
                esc_url($url),
                esc_html($directory_category['title']),
                esc_html($directory_category['description']),
                esc_html($directory_category['link_text'])
            );
            $schema_items[] = array(
                '@type' => 'ListItem',
                'position' => $position++,
                'name' => $directory_category['title'],
                'url' => $url,
            );
        }

        $popular_tools = array(
            array('title' => 'Merge PDF', 'slugs' => array('merge-pdf', 'merge'), 'icon' => 'combine'),
            array('title' => 'Compress PDF', 'slugs' => array('compress-pdf', 'compress'), 'icon' => 'compress'),
            array('title' => 'Flatten PDF', 'slugs' => array('flatten-pdf'), 'icon' => 'flatten'),
            array('title' => 'Protect PDF', 'slugs' => array('protect-pdf', 'protect'), 'icon' => 'lock'),
            array('title' => 'Add Page Numbers', 'slugs' => array('add-page-numbers-pdf', 'page-numbers'), 'icon' => 'numbers'),
            array('title' => 'Watermark PDF', 'slugs' => array('watermark-pdf', 'add-watermark-pdf'), 'icon' => 'watermark'),
        );
        $popular_links = '';

        foreach ($popular_tools as $tool) {
            $url = $this->find_published_page_url($tool['slugs']);
            if (!$url) {
                continue;
            }

            $popular_links .= sprintf(
                '<li><a href="%1$s"><span aria-hidden="true">%2$s</span>%3$s</a></li>',
                esc_url($url),
                $this->get_icon_svg($tool['icon']),
                esc_html($tool['title'])
            );
        }

        if (!$category_cards && current_user_can('manage_options')) {
            $category_cards = '<p class="quiconvert-react-error">' . esc_html__('Publish the PDF category pages to display the directory.', 'quiconvert-tools') . '</p>';
        }

        $popular_section = $popular_links
            ? '<section class="qc-directory-popular" aria-labelledby="qc-directory-popular-heading"><div><p class="qc-seo-eyebrow">' . esc_html__('QUICK ACCESS', 'quiconvert-tools') . '</p><h3 id="qc-directory-popular-heading">' . esc_html__('Popular PDF tools', 'quiconvert-tools') . '</h3></div><ul>' . $popular_links . '</ul></section>'
            : '';
        $schema = array('@context' => 'https://schema.org', '@type' => 'ItemList', 'itemListElement' => $schema_items);

        return sprintf(
            '<section class="qc-tools-directory" aria-labelledby="qc-tools-directory-heading"><header class="qc-tools-directory__intro"><p class="qc-seo-eyebrow">%1$s</p><%2$s id="qc-tools-directory-heading">%3$s</%2$s><p>%4$s</p></header><div class="qc-tools-directory__grid">%5$s</div>%6$s<script type="application/ld+json">%7$s</script></section>',
            esc_html__('EXPLORE QUICONVERT', 'quiconvert-tools'),
            $heading_tag,
            esc_html__('Browse PDF tools by category', 'quiconvert-tools'),
            esc_html__('Start with the result you need. Each category leads to focused PDF tools with clear instructions and direct downloads.', 'quiconvert-tools'),
            $category_cards,
            $popular_section,
            wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP)
        );
    }

    private function find_published_page_url($slugs) {
        foreach ($slugs as $slug) {
            $page = get_page_by_path($slug, OBJECT, 'page');
            if ($page instanceof WP_Post && $page->post_status === 'publish') {
                return get_permalink($page);
            }
        }
        return '';
    }

    private function count_published_tools($tools) {
        $count = 0;

        foreach ($tools as $tool) {
            if ($this->find_published_page_url($tool['slugs'])) {
                $count++;
            }
        }

        return $count;
    }

    private function tool($title, $description, $link_text, $slugs, $icon) {
        return compact('title', 'description', 'link_text', 'slugs', 'icon');
    }

    private function get_icon_svg($icon) {
        $paths = array(
            'files' => '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M10 13H8"/><path d="M16 17H8"/>',
            'combine' => '<rect width="8" height="8" x="3" y="3" rx="2"/><rect width="8" height="8" x="13" y="13" rx="2"/><path d="M11 7h2a4 4 0 0 1 4 4v2"/><path d="m15 11 2 2 2-2"/>',
            'scissors' => '<circle cx="6" cy="7" r="3"/><path d="m8.7 8.4 10.6 6.2"/><circle cx="6" cy="17" r="3"/><path d="m8.7 15.6 10.6-6.2"/>',
            'list-ordered' => '<line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
            'trash' => '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5"/><path d="M14 11v5"/>',
            'copy' => '<rect width="13" height="13" x="9" y="9" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/><path d="M15.5 12.5v6"/><path d="M12.5 15.5h6"/>',
            'extract' => '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8"/><path d="M14 2v6h6"/><path d="M10 13h8"/><path d="m15 10 3 3-3 3"/>',
            'reverse' => '<path d="m3 7 4-4 4 4"/><path d="M7 3v11a4 4 0 0 0 4 4h10"/><path d="m21 17-4 4-4-4"/>',
            'compress' => '<path d="m8 3-5 5"/><path d="M16 3h5v5"/><path d="M21 3l-5 5"/><path d="M8 21H3v-5"/><path d="m3 21 5-5"/><path d="m16 21 5-5"/>',
            'flatten' => '<path d="m12 2 8 4-8 4-8-4 8-4Z"/><path d="m4 10 8 4 8-4"/><path d="m4 14 8 4 8-4"/><path d="m4 18 8 4 8-4"/>',
            'lock' => '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
            'unlock' => '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.5-2"/>',
            'watermark' => '<path d="M4 4h16v16H4z"/><path d="m8 15 2-6 2 6 2-6 2 6"/>',
            'rotate' => '<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><path d="M21 3v5h-5"/>',
            'numbers' => '<path d="M4 17V9l-2 2"/><path d="M8 17h4l-4-4 4-4H8"/><path d="M16 9h4l-3 3 3 2v3h-4"/>',
            'help-circle' => '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.83 1c0 2-3 2-3 4"/><path d="M12 18h.01"/>',
        );

        $path = isset($paths[$icon]) ? $paths[$icon] : $paths['files'];
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" focusable="false">' . $path . '</svg>';
    }

    private function get_categories() {
        return array(
            'organize' => array(
                'icon' => 'list-ordered',
                'title' => 'Organize PDF Files Online',
                'intro' => 'Combine, separate, reorder, copy, extract, or remove PDF pages with tools designed for common document organization tasks.',
                'guide_title' => 'Choose the right PDF organization tool',
                'guide' => 'Merge combines complete files, while Split separates a document. Extract copies selected pages into a new PDF, Delete removes selected pages, and Rearrange changes their order. Use Duplicate for repeated pages or Reverse when the entire document is back to front.',
                'tools' => array(
                    $this->tool('Merge PDF', 'Combine multiple PDF files into one ordered document.', 'Merge PDF files', array('merge-pdf', 'merge'), 'combine'),
                    $this->tool('Split PDF', 'Separate one PDF into individual pages or selected ranges.', 'Split a PDF', array('split-pdf', 'split'), 'scissors'),
                    $this->tool('Rearrange PDF Pages', 'Change page order using a visual document preview.', 'Rearrange PDF pages', array('rearrange-pdf-pages', 'rearrange-pages'), 'list-ordered'),
                    $this->tool('Delete PDF Pages', 'Remove unwanted pages while retaining the remaining order.', 'Delete PDF pages', array('delete-pdf-pages', 'delete-pages'), 'trash'),
                    $this->tool('Duplicate PDF Pages', 'Add copies of selected pages to a PDF.', 'Duplicate PDF pages', array('duplicate-pdf-pages', 'duplicate-pages'), 'copy'),
                    $this->tool('Extract PDF Pages', 'Create a separate PDF from selected pages.', 'Extract PDF pages', array('extract-pdf-pages', 'extract'), 'extract'),
                    $this->tool('Reverse PDF Pages', 'Reverse the complete page sequence of a document.', 'Reverse PDF pages', array('reverse-pdf-pages', 'reverse-pages'), 'reverse'),
                ),
                'faq' => array(
                    array('Which tool combines several PDF files?', 'Use Merge PDF to combine complete files into one document.'),
                    array('Should I use Split, Extract, or Delete?', 'Split separates a document, Extract creates a new file from selected pages, and Delete creates a copy without selected pages.'),
                    array('Do these tools change my original file?', 'Processing creates a downloadable result. Keep the original until you have reviewed the new document.'),
                ),
            ),
            'optimize' => array(
                'icon' => 'compress',
                'title' => 'Optimize PDF Files Online',
                'intro' => 'Prepare PDFs for easier sharing, storage, printing, or archiving by reducing file size or fixing interactive content.',
                'guide_title' => 'Compression and flattening solve different problems',
                'guide' => 'Compress PDF targets file size and may affect image quality. Flatten PDF converts form fields and annotations into fixed page content. Keep the original before either operation and review the downloaded result.',
                'tools' => array(
                    $this->tool('Compress PDF', 'Reduce PDF file size with a selectable compression level.', 'Compress a PDF', array('compress-pdf', 'compress'), 'compress'),
                    $this->tool('Flatten PDF', 'Turn form fields and annotations into fixed page content.', 'Flatten a PDF', array('flatten-pdf'), 'flatten'),
                ),
                'faq' => array(
                    array('Does PDF optimization always reduce file size?', 'Compression may produce a small reduction when the source PDF is already optimized.'),
                    array('Is flattening the same as compression?', 'No. Flattening fixes interactive content, while compression focuses on reducing file size.'),
                    array('Should I keep the original PDF?', 'Yes. Keep the editable or higher-quality original until the processed copy has been reviewed.'),
                ),
            ),
            'secure' => array(
                'icon' => 'lock',
                'title' => 'Secure PDF Files Online',
                'intro' => 'Protect authorized documents, remove known passwords, or add visible watermark text before sharing and archiving.',
                'guide_title' => 'Choose access protection or visible labeling',
                'guide' => 'Protect PDF adds password access, Unlock removes protection when you know the password, and Watermark adds visible text. These tools serve different purposes and do not replace a qualified digital signature.',
                'tools' => array(
                    $this->tool('Protect PDF', 'Add password protection to a PDF copy.', 'Protect a PDF', array('protect-pdf', 'protect'), 'lock'),
                    $this->tool('Unlock PDF', 'Remove protection using the correct password and authorization.', 'Unlock a PDF', array('unlock-pdf', 'unlock'), 'unlock'),
                    $this->tool('Watermark PDF', 'Add visible custom text with selectable appearance.', 'Add a PDF watermark', array('watermark-pdf', 'add-watermark-pdf'), 'watermark'),
                ),
                'faq' => array(
                    array('Can QuiConvert recover an unknown PDF password?', 'No. Unlocking requires the correct password and permission to access the document.'),
                    array('Is a watermark the same as password protection?', 'No. A watermark is visible page content, while password protection controls access to the PDF.'),
                    array('Do these tools create a digital signature?', 'No. Passwords and visible watermarks do not provide the same function as a qualified digital signature.'),
                ),
            ),
            'edit' => array(
                'icon' => 'rotate',
                'title' => 'Edit PDF Pages Online',
                'intro' => 'Correct page orientation and add consistent page numbering with focused PDF editing tools.',
                'guide_title' => 'Make focused page-level changes',
                'guide' => 'Rotate PDF corrects sideways or upside-down pages. Page Numbers adds a consistent reference to document pages. Review the result for orientation and possible overlap with existing headers or footers.',
                'tools' => array(
                    $this->tool('Rotate PDF', 'Rotate PDF pages and save their corrected orientation.', 'Rotate a PDF', array('rotate-pdf', 'rotate'), 'rotate'),
                    $this->tool('Add PDF Page Numbers', 'Add consistent page numbers for easier reference.', 'Add PDF page numbers', array('add-page-numbers-pdf', 'page-numbers'), 'numbers'),
                ),
                'faq' => array(
                    array('Can I permanently rotate PDF pages?', 'Yes. The Rotate PDF tool writes the selected orientation to the processed copy.'),
                    array('Will numbering change the page order?', 'No. Page numbering is not intended to rearrange document pages.'),
                    array('Should I review existing headers and footers?', 'Yes. Check that new page numbers do not overlap existing content.'),
                ),
            ),
        );
    }
}
