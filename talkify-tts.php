<?php

/**
 * Plugin Name: Talkify Text to speech
 * Plugin URI: https://talkify.net
 * Description: Very easy to use, adds Talkify Text To Speech to your WordPress site. Let users listen to your content, great to increase your accessibility.
 * Version: 1.0.1
 * Author: Andreas Hagsten
 * License: GPLv2 or later
 */

class TalkifyTtsPlugin
{
    static $instance = false;
    private function __construct()
    {
        add_action('init', array($this, 'register_button_block'));
        add_action('admin_menu', array($this, 'addPluginAdminMenu'), 9);
        add_action('admin_init', array($this, 'registerAndBuildFields'));

        add_action('wp_enqueue_scripts', array($this, 'talkify_enqueue_style'));
        add_action('wp_enqueue_scripts', array($this, 'talkify_enqueue_script'));
    }

    public $plugin_name = "Talkify-tts";

    function talkify_enqueue_style()
    {
        wp_enqueue_style("fontawesome", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css");
        wp_enqueue_style("talkify-common", plugin_dir_url(__FILE__) . "styles/talkify-common.css");
        wp_enqueue_style("talkify-playlist", plugin_dir_url(__FILE__) . "styles/talkify-playlist.css");
        wp_enqueue_style("talkify-colors", plugin_dir_url(__FILE__) . "styles/colors.css");
        wp_enqueue_style("talkify-local-main", plugin_dir_url(__FILE__) . "styles/local-control-center/main.css");
        wp_enqueue_style("talkify-local-common", plugin_dir_url(__FILE__) . "styles/local-control-center/colors.css");
        wp_enqueue_style("talkify-modern-main", plugin_dir_url(__FILE__) . "styles/modern-control-center/main.css");
        wp_enqueue_style("talkify-modern-common", plugin_dir_url(__FILE__) . "styles/modern-control-center/colors.css");
        wp_enqueue_style("talkify-classic-main", plugin_dir_url(__FILE__) . "styles/classic-control-center/main.css");
        wp_enqueue_style("talkify-classic-common", plugin_dir_url(__FILE__) . "styles/classic-control-center/colors.css");
    }

    function talkify_enqueue_script()
    {
        wp_register_script("talkify-lib", plugin_dir_url(__FILE__) . 'scripts/talkify.min.js');
        wp_register_script("talkify-implementation", plugin_dir_url(__FILE__) . 'talkify-implementation.js');

        $script_params = array(
            'apiKey' => get_option('talkify_tts_api_key'),
            'controlcenter' => get_option('talkify_tts_control_center'),
            'useKeyboardCommands' => get_option('talkify_tts_keyboard_commands'),
            'useVoiceCommands' => get_option('talkify_tts_voice_commands'),
            'defaultVoice' => get_option('talkify_tts_default_voice'),
            'defaultRate' => get_option('talkify_tts_default_rate'),
            'selector' => get_option('talkify_tts_text_selecor'),
            'useVoicePicker' => get_option('talkify_tts_voice_picker'),
            'voiceClassFilter' => get_option('talkify_tts_voice_class_filter'),
            'voiceCultureFilter' => get_option('talkify_tts_voice_culture_filter'),
            'voiceLanguageFilter' => get_option('talkify_tts_voice_language_filter'),
            'controlcenterSelector' => get_option('talkify_tts_controlcenter_location'),
            'maximumRequestSize' => get_option('talkify_tts_maximum_request_size')
        );

        wp_localize_script('talkify-implementation', 'talkifyplugin', $script_params);

        wp_enqueue_script("talkify-lib", plugin_dir_url(__FILE__) . 'scripts/talkify.min.js');
        wp_enqueue_script("talkify-implementation", plugin_dir_url(__FILE__) . '/talkify-implementation.js');
    }

    public static function getInstance()
    {
        if (!self::$instance)
            self::$instance = new self;
        return self::$instance;
    }

    public function addPluginAdminMenu()
    {
        add_menu_page($this->plugin_name, $this->plugin_name, 'administrator', $this->plugin_name, array($this, 'displayPluginAdminSettings'), 'dashicons-format-status', 26);
    }

    public function displayPluginAdminDashboard()
    {
        require_once 'partials' . $this->plugin_name . '-admin-display.php';
    }

    public function displayPluginAdminSettings()
    {
        if (isset($_GET['error_message'])) {
            add_action('admin_notices', array($this, 'pluginNameSettingsMessages'));
            do_action('admin_notices', esc_html($_GET['error_message']));
        }
        require_once 'partials/' . $this->plugin_name . '-admin-settings-display.php';
    }

    public function pluginNameSettingsMessages($error_message)
    {
        switch ($error_message) {
            case '1':
                $message = __('There was an error adding this setting. Please try again.  If this persists, shoot us an email.', 'my-text-domain');
                $err_code = esc_attr('talkify_tts_api_key');
                $setting_field = 'talkify_tts_api_key';
                break;
        }
        $type = 'error';
        add_settings_error(
            $setting_field,
            $err_code,
            $message,
            $type
        );
    }

    public function registerAndBuildFields()
    {
        add_settings_section(
            'talkify_tts_general_section',
            'General settings',
            array($this, 'plugin_name_display_general_account'),
            'talkify_tts_general_settings'
        );

        unset($args);


        $this->RenderSetting('talkify_tts_api_key', 'API key', 'text');
        $this->RenderSetting('talkify_tts_keyboard_commands', 'Enable keyboard commands', 'checkbox');
        $this->RenderSetting('talkify_tts_voice_commands', 'Enable voice commands', 'checkbox');
        $this->RenderSetting('talkify_tts_maximum_request_size', 'Maximium characters per request', 'number', 'e.g. 3000');

        register_setting('talkify_tts_general_settings', 'talkify_tts_api_key');
        register_setting('talkify_tts_general_settings', 'talkify_tts_keyboard_commands', array('default' => true));
        register_setting('talkify_tts_general_settings', 'talkify_tts_voice_commands', array('default' => true));
        register_setting('talkify_tts_general_settings', 'talkify_tts_maximum_request_size', array('default' => 5000));
    }

    function RenderControlcenterSetting($id, $settings_label, $type, $placeholder = '')
    {
        $args = array(
            'type'      => 'input',
            'subtype'   => $type,
            'id'    => $id,
            'name'      => $id,
            'required' => 'true',
            'placeholder' => $placeholder,
            'get_options_list' => '',
            'value_type' => 'normal',
            'wp_data' => 'option'
        );

        add_settings_field(
            $id,
            $settings_label,
            array($this, 'plugin_name_render_settings_field'),
            'talkify_tts_controlcenter_settings',
            'talkify_tts_controlcenter_section',
            $args
        );
    }

    function RenderSetting($id, $settings_label, $type, $placeholder = '')
    {
        $args = array(
            'type'      => 'input',
            'subtype'   => $type,
            'id'    => $id,
            'name'      => $id,
            'required' => 'true',
            'placeholder' => $placeholder,
            'get_options_list' => '',
            'value_type' => 'normal',
            'wp_data' => 'option'
        );

        add_settings_field(
            $id,
            $settings_label,
            array($this, 'plugin_name_render_settings_field'),
            'talkify_tts_general_settings',
            'talkify_tts_general_section',
            $args
        );
    }

    public function plugin_name_display_general_account()
    {
        echo '<p>These settings apply to all Talkify TTS functionality.</p>';
    }

    public function display_controlcenter_config_section()
    {
        echo '<p>Settings for Talkify UI. Choose between four kind of control centers (modern, classic, local and native). Visit <a href="https://talkify.net">our demos to see them in action</a>.</p><p>Voice picker is not supported by the local control center.</p>';
    }

    public function plugin_name_render_settings_field($args)
    {
        if ($args['wp_data'] == 'option') {
            $wp_data_value = get_option($args['name']);
        } elseif ($args['wp_data'] == 'post_meta') {
            $wp_data_value = get_post_meta($args['post_id'], $args['name'], true);
        }

        switch ($args['type']) {
            case 'input':
                $value = ($args['value_type'] == 'serialized') ? serialize($wp_data_value) : $wp_data_value;
                if ($args['subtype'] != 'checkbox') {
                    $prependStart = (isset($args['prepend_value'])) ? '<div class="input-prepend"> <span class="add-on">' . $args['prepend_value'] . '</span>' : '';
                    $prependEnd = (isset($args['prepend_value'])) ? '</div>' : '';
                    $step = (isset($args['step'])) ? 'step="' . $args['step'] . '"' : '';
                    $min = (isset($args['min'])) ? 'min="' . $args['min'] . '"' : '';
                    $max = (isset($args['max'])) ? 'max="' . $args['max'] . '"' : '';
                    $placeholder = (isset($args['placeholder'])) ? $args['placeholder'] : '';
                    if (isset($args['disabled'])) {
                        echo $prependStart . '<input type="' . $args['subtype'] . '" id="' . $args['id'] . '_disabled" ' . $step . ' ' . $max . ' ' . $min . ' name="' . $args['name'] . '_disabled" size="40" disabled value="' . esc_attr($value) . '" /><input type="hidden" id="' . $args['id'] . '" ' . $step . ' ' . $max . ' ' . $min . ' name="' . $args['name'] . '" size="40" value="' . esc_attr($value) . '" />' . $prependEnd;
                    } else {
                        echo $prependStart . '<input type="' . $args['subtype'] . '" id="' . $args['id'] . '" "' . $args['required'] . '" ' . $step . ' ' . $max . ' ' . $min . ' name="' . $args['name'] . '" size="40" value="' . esc_attr($value) . '" placeholder="' . $placeholder . '"/>' . $prependEnd;
                    }
                } else {
                    $checked = ($value) ? 'checked' : '';
                    echo '<input type="' . $args['subtype'] . '" id="' . $args['id'] . '" "' . $args['required'] . '" name="' . $args['name'] . '" size="40" value="1" ' . $checked . ' />';
                }
                break;
            default:
                # code...
                break;
        }
    }

    function register_button_block()
    {
        $script_params = array(
            'apiKey' => get_option('talkify_tts_api_key')
        );

        wp_register_script('talkify-modern-button', plugins_url('build/modern.js', __FILE__), array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components'));
        wp_localize_script('talkify-modern-button', 'talkifyplugin', $script_params);

        wp_register_style(
            'talkify-modern-button-style-editor',
            plugins_url('build/local.css', __FILE__),
            array('wp-edit-blocks')
        );

        wp_register_style(
            'talkify-modern-button-style',
            plugins_url('build/local.css', __FILE__),
            array()
        );

        register_block_type('talkify-tts/talkify-modern-button', array(
            'style' => 'talkify-modern-button-style',
            'editor_style' => 'talkify-modern-button-style-editor',
            'editor_script' => 'talkify-modern-button',
        ));
    }
}

$WP_Talkify_Tts = TalkifyTtsPlugin::getInstance();
