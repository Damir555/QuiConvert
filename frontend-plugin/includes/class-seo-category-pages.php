<?php

if (!defined('ABSPATH')) {
    exit;
}

class QuiConvert_SEO_Category_Pages_R19 {
    const SHORTCODE = 'quiconvert_category_page';

    public function init() {
        add_shortcode(self::SHORTCODE, array($this, 'render_shortcode'));
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
                '<article class="qc-category-card"><h2><a href="%1$s">%2$s</a></h2><p>%3$s</p><a class="qc-category-card__link" href="%1$s">%4$s <span aria-hidden="true">&rarr;</span></a></article>',
                esc_url($url),
                esc_html($tool['title']),
                esc_html($tool['description']),
                esc_html($tool['link_text'])
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

        return sprintf(
            '<section class="qc-category-page qc-category-page--%1$s" aria-labelledby="qc-category-%1$s-heading"><header class="qc-seo-intro"><p class="qc-seo-eyebrow">%2$s</p><%3$s id="qc-category-%1$s-heading">%4$s</%3$s><p>%5$s</p></header><div class="qc-category-grid">%6$s</div><div class="qc-category-guide"><section><h2>%7$s</h2><p>%8$s</p></section><section><h2>%9$s</h2>%10$s</section></div><script type="application/ld+json">%11$s</script></section>',
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

    private function tool($title, $description, $link_text, $slugs) {
        return compact('title', 'description', 'link_text', 'slugs');
    }

    private function get_categories() {
        return array(
            'organize' => array(
                'title' => 'Organize PDF Files Online',
                'intro' => 'Combine, separate, reorder, copy, extract, or remove PDF pages with tools designed for common document organization tasks.',
                'guide_title' => 'Choose the right PDF organization tool',
                'guide' => 'Merge combines complete files, while Split separates a document. Extract copies selected pages into a new PDF, Delete removes selected pages, and Rearrange changes their order. Use Duplicate for repeated pages or Reverse when the entire document is back to front.',
                'tools' => array(
                    $this->tool('Merge PDF', 'Combine multiple PDF files into one ordered document.', 'Merge PDF files', array('merge-pdf', 'merge')),
                    $this->tool('Split PDF', 'Separate one PDF into individual pages or selected ranges.', 'Split a PDF', array('split-pdf', 'split')),
                    $this->tool('Rearrange PDF Pages', 'Change page order using a visual document preview.', 'Rearrange PDF pages', array('rearrange-pdf-pages', 'rearrange-pages')),
                    $this->tool('Delete PDF Pages', 'Remove unwanted pages while retaining the remaining order.', 'Delete PDF pages', array('delete-pdf-pages', 'delete-pages')),
                    $this->tool('Duplicate PDF Pages', 'Add copies of selected pages to a PDF.', 'Duplicate PDF pages', array('duplicate-pdf-pages', 'duplicate-pages')),
                    $this->tool('Extract PDF Pages', 'Create a separate PDF from selected pages.', 'Extract PDF pages', array('extract-pdf-pages', 'extract')),
                    $this->tool('Reverse PDF Pages', 'Reverse the complete page sequence of a document.', 'Reverse PDF pages', array('reverse-pdf-pages', 'reverse-pages')),
                ),
                'faq' => array(
                    array('Which tool combines several PDF files?', 'Use Merge PDF to combine complete files into one document.'),
                    array('Should I use Split, Extract, or Delete?', 'Split separates a document, Extract creates a new file from selected pages, and Delete creates a copy without selected pages.'),
                    array('Do these tools change my original file?', 'Processing creates a downloadable result. Keep the original until you have reviewed the new document.'),
                ),
            ),
            'optimize' => array(
                'title' => 'Optimize PDF Files Online',
                'intro' => 'Prepare PDFs for easier sharing, storage, printing, or archiving by reducing file size or fixing interactive content.',
                'guide_title' => 'Compression and flattening solve different problems',
                'guide' => 'Compress PDF targets file size and may affect image quality. Flatten PDF converts form fields and annotations into fixed page content. Keep the original before either operation and review the downloaded result.',
                'tools' => array(
                    $this->tool('Compress PDF', 'Reduce PDF file size with a selectable compression level.', 'Compress a PDF', array('compress-pdf', 'compress')),
                    $this->tool('Flatten PDF', 'Turn form fields and annotations into fixed page content.', 'Flatten a PDF', array('flatten-pdf')),
                ),
                'faq' => array(
                    array('Does PDF optimization always reduce file size?', 'Compression may produce a small reduction when the source PDF is already optimized.'),
                    array('Is flattening the same as compression?', 'No. Flattening fixes interactive content, while compression focuses on reducing file size.'),
                    array('Should I keep the original PDF?', 'Yes. Keep the editable or higher-quality original until the processed copy has been reviewed.'),
                ),
            ),
            'secure' => array(
                'title' => 'Secure PDF Files Online',
                'intro' => 'Protect authorized documents, remove known passwords, or add visible watermark text before sharing and archiving.',
                'guide_title' => 'Choose access protection or visible labeling',
                'guide' => 'Protect PDF adds password access, Unlock removes protection when you know the password, and Watermark adds visible text. These tools serve different purposes and do not replace a qualified digital signature.',
                'tools' => array(
                    $this->tool('Protect PDF', 'Add password protection to a PDF copy.', 'Protect a PDF', array('protect-pdf', 'protect')),
                    $this->tool('Unlock PDF', 'Remove protection using the correct password and authorization.', 'Unlock a PDF', array('unlock-pdf', 'unlock')),
                    $this->tool('Watermark PDF', 'Add visible custom text with selectable appearance.', 'Add a PDF watermark', array('watermark-pdf', 'add-watermark-pdf')),
                ),
                'faq' => array(
                    array('Can QuiConvert recover an unknown PDF password?', 'No. Unlocking requires the correct password and permission to access the document.'),
                    array('Is a watermark the same as password protection?', 'No. A watermark is visible page content, while password protection controls access to the PDF.'),
                    array('Do these tools create a digital signature?', 'No. Passwords and visible watermarks do not provide the same function as a qualified digital signature.'),
                ),
            ),
            'edit' => array(
                'title' => 'Edit PDF Pages Online',
                'intro' => 'Correct page orientation and add consistent page numbering with focused PDF editing tools.',
                'guide_title' => 'Make focused page-level changes',
                'guide' => 'Rotate PDF corrects sideways or upside-down pages. Page Numbers adds a consistent reference to document pages. Review the result for orientation and possible overlap with existing headers or footers.',
                'tools' => array(
                    $this->tool('Rotate PDF', 'Rotate PDF pages and save their corrected orientation.', 'Rotate a PDF', array('rotate-pdf', 'rotate')),
                    $this->tool('Add PDF Page Numbers', 'Add consistent page numbers for easier reference.', 'Add PDF page numbers', array('add-page-numbers-pdf', 'page-numbers')),
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
