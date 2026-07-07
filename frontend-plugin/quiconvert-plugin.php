<?php
/*
Plugin Name: QuiConvert Tools 7.0 Dev
Description: Development version of the QuiConvert frontend tools plugin.
Version: 7.0.0-dev
Author: QuiConvert Team
Text Domain: quiconvert-tools
*/

if (!defined('ABSPATH')) exit;

define('QUICONVERT_VERSION', '7.0.0-dev');
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
