<?php

if (!defined('ABSPATH')) {
    exit;
}

class QuiConvert_SEO_Blog_Article_R20_4 {
    const CATEGORY_SLUG = 'pdf-guides';

    public function init() {
        add_filter('the_content', array($this, 'render_guide'), 20);
    }

    public function render_guide($content) {
        if (
            is_admin() ||
            is_feed() ||
            !is_singular('post') ||
            !in_the_loop() ||
            !is_main_query()
        ) {
            return $content;
        }

        $post_id = get_the_ID();

        if (!$post_id || !has_category(self::CATEGORY_SLUG, $post_id)) {
            return $content;
        }

        return sprintf(
            '<div class="qc-guide-shell">%1$s<div class="qc-guide-article">%2$s</div>%3$s</div>',
            $this->render_back_link(),
            $content,
            $this->render_related_tools()
        );
    }

    private function render_back_link() {
        $blog_page = get_page_by_path('blog', OBJECT, 'page');

        if (!($blog_page instanceof WP_Post) || $blog_page->post_status !== 'publish') {
            return '';
        }

        return sprintf(
            '<nav class="qc-guide-back" aria-label="%1$s"><a href="%2$s"><span aria-hidden="true">&larr;</span> %3$s</a></nav>',
            esc_attr__('Guide navigation', 'quiconvert-tools'),
            esc_url(get_permalink($blog_page)),
            esc_html__('All PDF guides', 'quiconvert-tools')
        );
    }

    private function render_related_tools() {
        $tools = array(
            array(
                'slugs' => array('organize-pdf'),
                'title' => __('Organize PDF tools', 'quiconvert-tools'),
                'description' => __('Compare every tool for arranging, separating, and selecting PDF pages.', 'quiconvert-tools'),
            ),
            array(
                'slugs' => array('merge', 'merge-pdf'),
                'title' => __('Merge PDF', 'quiconvert-tools'),
                'description' => __('Combine complete PDF files into one document in the required order.', 'quiconvert-tools'),
            ),
            array(
                'slugs' => array('rearrange-pages', 'rearrange-pdf'),
                'title' => __('Rearrange PDF Pages', 'quiconvert-tools'),
                'description' => __('Move existing pages into the correct reading sequence.', 'quiconvert-tools'),
            ),
            array(
                'slugs' => array('extract', 'extract-pages', 'extract-pdf-pages'),
                'title' => __('Extract PDF Pages', 'quiconvert-tools'),
                'description' => __('Create a new PDF containing only the pages you select.', 'quiconvert-tools'),
            ),
        );

        $cards = '';

        foreach ($tools as $tool) {
            $url = $this->find_published_page_url($tool['slugs']);

            if (!$url) {
                continue;
            }

            $cards .= sprintf(
                '<a class="qc-guide-related__card" href="%1$s"><span class="qc-guide-related__icon" aria-hidden="true">%2$s</span><span><strong>%3$s</strong><small>%4$s</small></span><span class="qc-guide-related__arrow" aria-hidden="true">&rarr;</span></a>',
                esc_url($url),
                $this->document_icon(),
                esc_html($tool['title']),
                esc_html($tool['description'])
            );
        }

        if ($cards === '') {
            return '';
        }

        return sprintf(
            '<aside class="qc-guide-related" aria-labelledby="qc-guide-related-heading"><p class="qc-guide-related__eyebrow">%1$s</p><h2 id="qc-guide-related-heading">%2$s</h2><p class="qc-guide-related__intro">%3$s</p><div class="qc-guide-related__grid">%4$s</div></aside>',
            esc_html__('CONTINUE WITH QUICONVERT', 'quiconvert-tools'),
            esc_html__('Related PDF tools', 'quiconvert-tools'),
            esc_html__('Choose the next task in your workflow and process the document directly in your browser.', 'quiconvert-tools'),
            $cards
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

    private function document_icon() {
        return '<svg viewBox="0 0 24 24" role="presentation" focusable="false"><path d="M7 3h7l4 4v14H7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 3v5h4M10 12h5M10 16h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
}
