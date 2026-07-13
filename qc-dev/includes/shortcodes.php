<?php
if (!defined('ABSPATH')) {
    exit;
}

function qc_dev_test_shortcode() {
    return '<div style="padding:20px;background:#d9ffd9;border:2px solid green;">
        QC Dev Kit radi!
    </div>';
}

add_shortcode('qc_test', 'qc_dev_test_shortcode');

function qc_dev_upload_shortcode($atts = array()) {
    $atts = shortcode_atts(
        array(
            'tool' => 'merge',
        ),
        $atts,
        'qc_upload'
    );

    $tool = sanitize_key($atts['tool']);

    $allowed_tools = array('merge', 'split', 'compress', 'rotate');

    if (!in_array($tool, $allowed_tools, true)) {
        $tool = 'merge';
    }

    ob_start();

    include QC_DEV_PLUGIN_DIR . 'templates/upload-card.php';

    return ob_get_clean();
}

add_shortcode('qc_upload', 'qc_dev_upload_shortcode');