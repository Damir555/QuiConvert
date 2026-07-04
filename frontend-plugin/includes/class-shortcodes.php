<?php
if (!defined('ABSPATH')) exit;

class QuiConvert_Shortcodes_512 {
    public static function render_tool($atts = array()) {
        $atts = shortcode_atts(array(
            'action' => 'all',
            'show_email' => 'false'
        ), $atts, 'quiconvert_tool');

        $tools = QuiConvert_Config_512::tools();
        $action = sanitize_text_field($atts['action']);

        if ($action !== 'all' && !array_key_exists($action, $tools)) {
            $action = 'all';
        }

        $title = 'Upload and process PDF files';
        $subtitle = 'Drag & drop files here, or click to select';

        if ($action !== 'all') {
            $title = $tools[$action]['title'];
            $subtitle = $tools[$action]['subtitle'];
        }

        $input_multiple = ($action === 'merge' || $action === 'all') ? ' multiple' : '';

        ob_start();
        include QUICONVERT_PLUGIN_DIR . 'templates/tool.php';
        return ob_get_clean();
    }
}
