<?php
/*
Plugin Name: QuiConvert Plugin 5.1.3
Description: QuiConvert Runtime stable release with Event Bus. Stable frontend foundation for Merge, Split and Compress.
Version: 5.1.3
Author: QuiConvert Team
Text Domain: quiconvert-plugin-5-1-3-rc3
*/

if (!defined('ABSPATH')) exit;

define('QUICONVERT_VERSION', '5.1.3');
define('QUICONVERT_RUNTIME_VERSION', '0.8.0');
define('QUICONVERT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('QUICONVERT_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once QUICONVERT_PLUGIN_DIR . 'includes/class-config.php';
require_once QUICONVERT_PLUGIN_DIR . 'includes/class-plugin.php';
require_once QUICONVERT_PLUGIN_DIR . 'includes/class-shortcodes.php';

function quiconvert_plugin_boot_512() {
    $plugin = new QuiConvert_Plugin_512();
    $plugin->init();
}
add_action('plugins_loaded', 'quiconvert_plugin_boot_512');
