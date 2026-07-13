<?php
if (!defined('ABSPATH')) {
    exit;
}

function qc_dev_enqueue_assets() {

    wp_enqueue_style(
        'qc-dev-upload',
        QC_DEV_PLUGIN_URL . 'assets/css/qc-upload.css',
        array(),
        QC_DEV_VERSION
    );

    wp_enqueue_script(
        'qc-dev-upload',
        QC_DEV_PLUGIN_URL . 'assets/js/qc-upload.js',
        array(),
        QC_DEV_VERSION,
        true
    );

    wp_localize_script(
        'qc-dev-upload',
        'qcConfig',
        array(
            'api' => array(
                'merge' => 'https://quiconvert-backend.onrender.com/api/pdf/merge',
                'split' => 'https://quiconvert-backend.onrender.com/api/pdf/split',
                'compress' => 'https://quiconvert-backend.onrender.com/api/pdf/compress',
                'rotate' => 'https://quiconvert-backend.onrender.com/api/pdf/rotate'
            )
        )
    );
}

add_action('wp_enqueue_scripts', 'qc_dev_enqueue_assets');