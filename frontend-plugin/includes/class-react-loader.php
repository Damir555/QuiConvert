<?php

if (!defined('ABSPATH')) {
    exit;
}

class QuiConvert_React_Loader_R15 {
    const SCRIPT_HANDLE = 'quiconvert-react-app';
    const SHORTCODE = 'quiconvert_react';
    const FLATTEN_SHORTCODE = 'quiconvert_flatten_pdf';

    private $assets_enqueued = false;

    public function init() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_for_shortcode_page'));
        add_shortcode(self::SHORTCODE, array($this, 'render_shortcode'));
        add_shortcode(self::FLATTEN_SHORTCODE, array($this, 'render_flatten_shortcode'));
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

    public function render_flatten_shortcode($atts = array()) {
        $atts = shortcode_atts(
            array('class' => ''),
            $atts,
            self::FLATTEN_SHORTCODE
        );

        $workspace = $this->render_react_host($atts['class'], 'flatten');

        if (strpos($workspace, 'data-quiconvert-react-root') === false) {
            return $workspace;
        }

        $privacy_url = get_privacy_policy_url();
        $privacy_link = $privacy_url
            ? sprintf(
                '<p class="qc-seo-note">%s <a href="%s">%s</a></p>',
                esc_html__('For more information, read our', 'quiconvert-tools'),
                esc_url($privacy_url),
                esc_html__('Privacy Policy', 'quiconvert-tools')
            )
            : '';

        $faq_items = array(
            array(
                'question' => __('What does flattening a PDF do?', 'quiconvert-tools'),
                'answer' => __('Flattening converts interactive form fields and annotations into fixed page content so they are no longer editable as separate objects.', 'quiconvert-tools'),
            ),
            array(
                'question' => __('Will the flattened PDF look the same?', 'quiconvert-tools'),
                'answer' => __('The tool is designed to preserve the visible page content while removing interactive form fields and annotations. Always review the downloaded document before sharing it.', 'quiconvert-tools'),
            ),
            array(
                'question' => __('Can I flatten a password-protected PDF?', 'quiconvert-tools'),
                'answer' => __('A protected document must be unlocked with the correct password before it can be flattened.', 'quiconvert-tools'),
            ),
        );

        $faq_html = '';
        $schema_entities = array();

        foreach ($faq_items as $item) {
            $faq_html .= sprintf(
                '<details class="qc-seo-faq"><summary>%s</summary><p>%s</p></details>',
                esc_html($item['question']),
                esc_html($item['answer'])
            );
            $schema_entities[] = array(
                '@type' => 'Question',
                'name' => $item['question'],
                'acceptedAnswer' => array(
                    '@type' => 'Answer',
                    'text' => $item['answer'],
                ),
            );
        }

        $schema = array(
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => $schema_entities,
        );

        return '<section class="qc-seo-tool-page" aria-labelledby="qc-flatten-heading">' .
            '<header class="qc-seo-intro">' .
                '<p class="qc-seo-eyebrow">' . esc_html__('ONLINE PDF TOOL', 'quiconvert-tools') . '</p>' .
                '<h2 id="qc-flatten-heading">' . esc_html__('Flatten PDF online', 'quiconvert-tools') . '</h2>' .
                '<p>' . esc_html__('Turn form fields and annotations into fixed PDF page content. Upload one PDF, process it, and download the flattened copy.', 'quiconvert-tools') . '</p>' .
            '</header>' .
            $workspace .
            '<div class="qc-seo-content">' .
                '<section aria-labelledby="qc-flatten-how"><h2 id="qc-flatten-how">' . esc_html__('How to flatten a PDF', 'quiconvert-tools') . '</h2>' .
                    '<ol><li>' . esc_html__('Select or drop one PDF file.', 'quiconvert-tools') . '</li>' .
                    '<li>' . esc_html__('Choose Flatten PDF and start processing.', 'quiconvert-tools') . '</li>' .
                    '<li>' . esc_html__('Download and review the flattened document.', 'quiconvert-tools') . '</li></ol></section>' .
                '<section aria-labelledby="qc-flatten-when"><h2 id="qc-flatten-when">' . esc_html__('When should you flatten a PDF?', 'quiconvert-tools') . '</h2>' .
                    '<p>' . esc_html__('Flattening is useful before sharing, printing, or archiving a completed form. It can prevent recipients from accidentally changing form values or moving annotations. Flattening is not the same as password protection or a digital signature.', 'quiconvert-tools') . '</p></section>' .
                '<section aria-labelledby="qc-flatten-safety"><h2 id="qc-flatten-safety">' . esc_html__('Check the result before sharing', 'quiconvert-tools') . '</h2>' .
                    '<p>' . esc_html__('Flattening is normally irreversible in the downloaded copy. Keep your original document if you may need to edit its fields or annotations later.', 'quiconvert-tools') . '</p>' . $privacy_link . '</section>' .
                '<section aria-labelledby="qc-flatten-faq"><h2 id="qc-flatten-faq">' . esc_html__('Frequently asked questions', 'quiconvert-tools') . '</h2>' . $faq_html . '</section>' .
            '</div>' .
            '<script type="application/ld+json">' . wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP) . '</script>' .
        '</section>';
    }

    private function render_react_host($class, $tool) {

        if (!$this->enqueue_assets()) {
            if (current_user_can('manage_options')) {
                return '<div class="quiconvert-react-error">' .
                    esc_html__('QuiConvert React build is missing or invalid. Rebuild and reinstall the R15 plugin package.', 'quiconvert-tools') .
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
            '<div class="%s" data-quiconvert-react-root data-initial-tool="%s"></div><noscript>%s</noscript>',
            esc_attr($classes),
            esc_attr($initial_tool),
            esc_html__('JavaScript is required to use QuiConvert PDF tools.', 'quiconvert-tools')
        );
    }

    private function post_uses_react($post) {
        return has_shortcode($post->post_content, self::SHORTCODE) ||
            has_shortcode($post->post_content, self::FLATTEN_SHORTCODE);
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
