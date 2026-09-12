<?php

if (!defined('ABSPATH')) {
    exit;
}

class QuiConvert_React_Loader_R15 {
    const SCRIPT_HANDLE = 'quiconvert-react-app';
    const SHORTCODE = 'quiconvert_react';

    private $assets_enqueued = false;
    private $seo_pages;
    private $seo_categories;

    public function init() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_for_shortcode_page'));
        add_shortcode(self::SHORTCODE, array($this, 'render_shortcode'));
        $this->seo_pages = new QuiConvert_SEO_Tool_Pages_R18_1(array($this, 'render_react_host'));
        $this->seo_pages->init();
        $this->seo_categories = new QuiConvert_SEO_Category_Pages_R19();
        $this->seo_categories->init();
        add_filter('script_loader_tag', array($this, 'mark_entry_as_module'), 10, 2);
    }

    public function enqueue_for_shortcode_page() {
        if (!is_singular()) {
            return;
        }

        $post = get_queried_object();

        if (!($post instanceof WP_Post) || (!$this->post_uses_react($post))) {
            return;
        }

        $this->enqueue_assets();
    }

    public function render_shortcode($atts = array()) {
        $atts = shortcode_atts(
            array(
                'class' => '',
                'tool' => 'merge',
            ),
            $atts,
            self::SHORTCODE
        );

        return $this->render_react_host($atts['class'], $atts['tool']);
    }

    public function render_react_host($class, $tool, $dedicated = false) {

        if (!$this->enqueue_assets()) {
            if (current_user_can('manage_options')) {
                return '<div class="quiconvert-react-error">' .
                    esc_html__('QuiConvert React build is missing or invalid. Rebuild and reinstall the current plugin package.', 'quiconvert-tools') .
                    '</div>';
            }

            return '<div class="quiconvert-react-error">' .
                esc_html__('The PDF workspace is temporarily unavailable.', 'quiconvert-tools') .
                '</div>';
        }

        $extra_class = sanitize_html_class($class);
        $classes = trim('quiconvert-react-host ' . $extra_class);
        $allowed_tools = array('merge', 'split', 'rotate', 'compress', 'flatten', 'rearrange', 'delete', 'duplicate', 'extract', 'reverse', 'page-numbers', 'protect', 'unlock', 'watermark');
        $initial_tool = in_array($tool, $allowed_tools, true) ? $tool : 'merge';

        return sprintf(
            '<div class="%s" data-quiconvert-react-root data-initial-tool="%s"%s></div><noscript>%s</noscript>',
            esc_attr($classes),
            esc_attr($initial_tool),
            $dedicated ? ' data-dedicated-tool="true"' : '',
            esc_html__('JavaScript is required to use QuiConvert PDF tools.', 'quiconvert-tools')
        );
    }

    private function post_uses_react($post) {
        return has_shortcode($post->post_content, self::SHORTCODE) ||
            has_shortcode($post->post_content, QuiConvert_SEO_Tool_Pages_R18_1::SHORTCODE) ||
            has_shortcode($post->post_content, QuiConvert_SEO_Tool_Pages_R18_1::FLATTEN_ALIAS) ||
            has_shortcode($post->post_content, QuiConvert_SEO_Category_Pages_R19::SHORTCODE) ||
            has_shortcode($post->post_content, QuiConvert_SEO_Category_Pages_R19::DIRECTORY_SHORTCODE);
    }

    public function mark_entry_as_module($tag, $handle) {
        if ($handle !== self::SCRIPT_HANDLE) {
            return $tag;
        }

        $tag = preg_replace('/\s+type=(["\'])[^"\']*\1/i', '', $tag, 1);
        return preg_replace('/<script\s/i', '<script type="module" ', $tag, 1);
    }

    private function enqueue_assets() {
        if ($this->assets_enqueued) {
            return true;
        }

        $entry = $this->get_manifest_entry();

        if (!$entry) {
            return false;
        }

        $build_url = trailingslashit(QUICONVERT_REACT_URL . 'react-build');
        $build_dir = trailingslashit(QUICONVERT_REACT_DIR . 'react-build');
        $css_files = isset($entry['css']) && is_array($entry['css']) ? $entry['css'] : array();

        foreach ($css_files as $index => $css_file) {
            $relative_file = $this->sanitize_asset_path($css_file);

            if (!$relative_file || !is_file($build_dir . $relative_file)) {
                return false;
            }

            wp_enqueue_style(
                'quiconvert-react-' . $index,
                $build_url . $relative_file,
                array(),
                (string) filemtime($build_dir . $relative_file)
            );
        }

        $entry_file = isset($entry['file']) ? $this->sanitize_asset_path($entry['file']) : '';

        if (!$entry_file || !is_file($build_dir . $entry_file)) {
            return false;
        }

        wp_enqueue_script(
            self::SCRIPT_HANDLE,
            $build_url . $entry_file,
            array(),
            (string) filemtime($build_dir . $entry_file),
            true
        );

        $this->assets_enqueued = true;
        return true;
    }

    private function get_manifest_entry() {
        $manifest_path = QUICONVERT_REACT_DIR . 'react-build/.vite/manifest.json';

        if (!is_readable($manifest_path)) {
            return null;
        }

        $manifest = json_decode(file_get_contents($manifest_path), true);

        if (!is_array($manifest)) {
            return null;
        }

        foreach ($manifest as $entry) {
            if (is_array($entry) && !empty($entry['isEntry']) && !empty($entry['file'])) {
                return $entry;
            }
        }

        return null;
    }

    private function sanitize_asset_path($path) {
        if (!is_string($path) || $path === '') {
            return '';
        }

        $path = ltrim(str_replace('\\', '/', $path), '/');

        if (strpos($path, '../') !== false || strpos($path, '://') !== false) {
            return '';
        }

        return $path;
    }
}
