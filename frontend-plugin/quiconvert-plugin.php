<?php
/*
Plugin Name: QuiConvert React Tools
Description: Loads the QuiConvert React PDF workspace from a Vite production build.
Version: 8.0.0-r20.4
Author: QuiConvert Team
Text Domain: quiconvert-tools
*/

if (!defined('ABSPATH')) {
    exit;
}

define('QUICONVERT_REACT_VERSION', '8.0.0-r20.4');
define('QUICONVERT_REACT_DIR', plugin_dir_path(__FILE__));
define('QUICONVERT_REACT_URL', plugin_dir_url(__FILE__));

require_once QUICONVERT_REACT_DIR . 'includes/class-seo-tool-pages.php';
require_once QUICONVERT_REACT_DIR . 'includes/class-seo-category-pages.php';
require_once QUICONVERT_REACT_DIR . 'includes/class-seo-blog-index.php';
require_once QUICONVERT_REACT_DIR . 'includes/class-seo-blog-article.php';
require_once QUICONVERT_REACT_DIR . 'includes/class-react-loader.php';

function quiconvert_react_boot_r15() {
    $loader = new QuiConvert_React_Loader_R15();
    $loader->init();
}

add_action('plugins_loaded', 'quiconvert_react_boot_r15');
