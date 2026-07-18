<?php

if (!defined('ABSPATH')) {
    exit;
}


/*
 * Legacy shortcode.
 *
 * Privremeno ostaje dostupan dok novi qc-core
 * adapter ne prođe WordPress test.
 */
function qc_dev_upload_shortcode($atts = array()) {
    $atts = shortcode_atts(
        array(
            'tool' => 'merge',
        ),
        $atts,
        'qc_upload'
    );

    $tool = sanitize_key($atts['tool']);

    $allowed_tools = array(
        'merge',
        'split',
        'compress',
        'rotate',
    );

    if (!in_array($tool, $allowed_tools, true)) {
        $tool = 'merge';
    }

    ob_start();

    include QC_DEV_PLUGIN_DIR
        . 'templates/upload-card.php';

    return ob_get_clean();
}

add_shortcode(
    'qc_upload',
    'qc_dev_upload_shortcode'
);


/*
 * Novi shortcode za aktualni qc-core.
 */
function qc_dev_core_shortcode($atts = array()) {
    $atts = shortcode_atts(
        array(
            'tool' => 'merge',
        ),
        $atts,
        'qc_core'
    );

    $tool = sanitize_key($atts['tool']);

    $allowed_tools = array(
        'merge',
        'split',
        'rotate',
        'compress',
        'protect',
        'unlock',
        'watermark',
        'rearrange',
        'delete-pages',
        'duplicate-pages',
        'extract-pages',
        'reverse-pages',
        'page-numbers',
        'image-to-pdf',
        'pdf-to-images',
    );

    if (!in_array($tool, $allowed_tools, true)) {
        $tool = 'merge';
    }

    $instance_id = wp_unique_id(
        'quiconvert-core-'
    );

    ob_start();

    include QC_DEV_PLUGIN_DIR
        . 'templates/core-app.php';

    return ob_get_clean();
}

add_shortcode(
    'qc_core',
    'qc_dev_core_shortcode'
);