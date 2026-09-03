<?php

if (!defined('ABSPATH')) {
    exit;
}

function qc_dev_enqueue_assets() {
    /*
     * Legacy frontend.
     *
     * Privremeno ostaje aktivan dok novi qc-core
     * WordPress adapter ne prođe test.
     */
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

    /*
     * Novi qc-core frontend.
     */
    wp_enqueue_style(
        'qc-dev-core',
        QC_DEV_PLUGIN_URL . 'assets/core/qc-core.css',
        array(),
        QC_DEV_VERSION
    );

    wp_enqueue_script(
        'qc-dev-core-adapter',
        QC_DEV_PLUGIN_URL . 'assets/js/qc-core-adapter.js',
        array(),
        QC_DEV_VERSION,
        true
    );

    /*
     * Konfiguracija dostupna i legacy adapteru
     * i novom qc-core adapteru.
     */
    wp_localize_script(
        'qc-dev-core-adapter',
        'qcConfig',
        array(
            'apiBase' =>
                'https://quiconvert-backend.onrender.com',

            'pluginVersion' =>
                QC_DEV_VERSION,

            /*
             * Privremena kompatibilnost sa starim
             * qc-upload.js.
             */
            'api' => array(
                'merge' =>
                    'https://quiconvert-backend.onrender.com/api/pdf/merge',

                'split' =>
                    'https://quiconvert-backend.onrender.com/api/pdf/split',

                'compress' =>
                    'https://quiconvert-backend.onrender.com/api/pdf/compress',

                'rotate' =>
                    'https://quiconvert-backend.onrender.com/api/pdf/rotate',
            ),
        )
    );
}

add_action(
    'wp_enqueue_scripts',
    'qc_dev_enqueue_assets'
);


/*
 * Novi WordPress adapter koristi ES module import,
 * pa njegov script tag mora imati type="module".
 */
function qc_dev_add_module_type(
    $tag,
    $handle,
    $src
) {
    if ($handle !== 'qc-dev-core-adapter') {
        return $tag;
    }

    return sprintf(
        '<script type="module" src="%s"></script>' . "\n",
        esc_url($src)
    );
}

add_filter(
    'script_loader_tag',
    'qc_dev_add_module_type',
    10,
    3
);