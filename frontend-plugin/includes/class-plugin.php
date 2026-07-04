<?php
if (!defined('ABSPATH')) exit;

class QuiConvert_Plugin_512 {
    public function init() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_shortcode('quiconvert_tool', array('QuiConvert_Shortcodes_512', 'render_tool'));
        add_shortcode('quiconvert_upload_v512', array('QuiConvert_Shortcodes_512', 'render_tool'));
    }

    public function enqueue_assets() {
        wp_enqueue_style('quiconvert-512-style', QUICONVERT_PLUGIN_URL . 'assets/css/quiconvert.css', array(), QUICONVERT_VERSION);

        wp_enqueue_script('quiconvert-512-registry', QUICONVERT_PLUGIN_URL . 'assets/js/registry.js', array(), QUICONVERT_VERSION, true);
        wp_enqueue_script('quiconvert-512-events', QUICONVERT_PLUGIN_URL . 'assets/js/events.js', array('quiconvert-512-registry'), QUICONVERT_VERSION, true);
        wp_enqueue_script('quiconvert-512-state', QUICONVERT_PLUGIN_URL . 'assets/js/state.js', array('quiconvert-512-registry'), QUICONVERT_VERSION, true);
        wp_enqueue_script('quiconvert-512-notification', QUICONVERT_PLUGIN_URL . 'assets/js/notification.js', array('quiconvert-512-registry'), QUICONVERT_VERSION, true);
        wp_enqueue_script('quiconvert-512-ui', QUICONVERT_PLUGIN_URL . 'assets/js/ui.js', array('quiconvert-512-registry', 'quiconvert-512-state', 'quiconvert-512-notification'), QUICONVERT_VERSION, true);
        wp_enqueue_script('quiconvert-512-api', QUICONVERT_PLUGIN_URL . 'assets/js/api.js', array('quiconvert-512-registry'), QUICONVERT_VERSION, true);
        wp_enqueue_script('quiconvert-512-uploader', QUICONVERT_PLUGIN_URL . 'assets/js/uploader.js', array('quiconvert-512-registry', 'quiconvert-512-state', 'quiconvert-512-notification', 'quiconvert-512-ui', 'quiconvert-512-api'), QUICONVERT_VERSION, true);

        wp_localize_script('quiconvert-512-registry', 'QuiConvert512Config', array(
            'apiBase' => QuiConvert_Config_512::api_base(),
            'developerMode' => true,
            'pluginVersion' => QUICONVERT_VERSION,
            'runtimeVersion' => QUICONVERT_RUNTIME_VERSION,
            'apiKey' => QuiConvert_Config_512::api_key(),
            'maxUploadMb' => QuiConvert_Config_512::max_upload_mb(),
            'tools' => QuiConvert_Config_512::tools(),
            'strings' => QuiConvert_Config_512::strings()
        ));
    }
}
