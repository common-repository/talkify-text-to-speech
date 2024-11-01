(function (blocks, i18n, element, blockEditor, components) {
    var jQ = $ || jQuery;

    const colors = [
        { name: 'talkify', color: '#8ac832' },
        { name: 'primary', color: '#0073a8' },
        { name: 'secondary', color: '#005075' },
        { name: 'dark', color: '#111111' },
    ];

    const textColors = [
        { name: 'white', color: '#fff' },
        { name: 'lightgray', color: '#999' },
        { name: 'gray', color: '#444' },
        { name: 'black', color: '#000' },
    ];

    const fontSizes = [
        {
            name: 'Extra samll',
            slug: 'xsmall',
            size: 12,
        },
        {
            name: 'Small',
            slug: 'small',
            size: 14,
        },
        {
            name: 'Normal',
            slug: 'normal',
            size: 16,
        },
        {
            name: 'Large',
            slug: 'large',
            size: 18,
        },
        {
            name: 'Extra large',
            slug: 'xlarge',
            size: 20,
        }
    ];

    if (!window.talkifyplugin.apiKey) {
        registerBlockType([{ Name: 'David', Language: 'English', Culture: 'en-US' }]);

        return;
    }

    jQ.get('https://talkify.net/api/speech/v2/voices?key=' + window.talkifyplugin.apiKey).done(function (voices) {
        registerBlockType(voices);
    }).fail(function () {
        registerBlockType([{ Name: 'David', Language: 'English', Culture: 'en-US' }]);
    });

    function registerBlockType(voices) {
        voices.forEach(function (v) {
            v.label = v.Name + " - " + v.Language + " - " + v.Culture;
            v.value = v.Name;
        });

        voices = voices.sort(function(a, b){
            return a.Language < b.Language && a.Culture < b.Culture;
        });

        var el = element.createElement;
        var __ = i18n.__;
        var inspectorControls = blockEditor.InspectorControls;
        var PanelBody = components.PanelBody;
        var fragment = element.Fragment;
        var checkboxControl = wp.components.CheckboxControl;
        var textbox = wp.components.TextControl;

        blocks.registerBlockType('talkify-tts/button', {
            title: 'Talkify',
            icon: 'controls-volumeon',
            category: 'layout',
            attributes: {
                removeOnclickCheckbox: {
                    type: 'boolean',
                    default: true
                },
                textHighlightEnabled: {
                    type: 'boolean',
                    default: true
                },
                textInteractionEnabled: {
                    type: 'boolean',
                    default: false
                },
                buttonTextField: {
                    type: 'string',
                    default: "Listen to page"
                },
                defaultVoice: {
                    type: 'string',
                    default: "David"
                },
                defaultRate: {
                    type: 'number',
                    default: 0
                },
                defaultPitch: {
                    type: 'number',
                    default: 0
                },
                defaultWordbreak: {
                    type: 'number',
                    default: 0
                },
                controlCenter: {
                    type: 'string',
                    default: "modern"
                },
                autoplay: {
                    type: 'boolean',
                    default: false
                },
                backgroundColor: {
                    type: 'string',
                    default: colors[0]
                },
                textColor: {
                    type: 'string',
                    default: textColors[0]
                },
                padding: {
                    type: 'string',
                    default: '10px'
                },
                fontSize: {
                    type: 'number',
                    default: '16'
                },
                rootSelector: {
                    type: 'string',
                    default: ''
                },
                elementsSelector: {
                    type: 'string',
                    default: ''
                },
                voicePickerEnabled: {
                    type: 'boolean',
                    default: 'true'
                },
                voiceClassFilter: {
                    type: 'string',
                    default: ''
                },
                voiceLanguageFilter: {
                    type: 'string',
                    default: ''
                },
                voiceCultureFilter: {
                    type: 'string',
                    default: ''
                },
                content: {
                    type: 'string',
                    source: 'text',
                    selector: 'button'
                }
            },
            edit: function (props) {
                function onChangeRemoveOnclickCheckboxField(newValue) {
                    props.setAttributes({ removeOnclickCheckbox: newValue });
                }

                function onChangeCheckboxField2(newValue) {
                    props.setAttributes({ checkboxField2: newValue });
                }

                function onChangeButtonTextField(newValue) {
                    props.setAttributes({ buttonTextField: newValue });
                }

                function onChangeDefaultVoice(newValue) {
                    props.setAttributes({ defaultVoice: newValue });
                }

                function onChangeDefaultRate(newValue) {
                    props.setAttributes({ defaultRate: newValue });
                }

                function onChangeDefaultPitch(newValue) {
                    props.setAttributes({ defaultPitch: newValue });
                }

                function onChangeControlCenter(newValue) {
                    props.setAttributes({ controlCenter: newValue });
                }

                function onChangeTextInteration(newValue) {
                    props.setAttributes({ textInteractionEnabled: newValue });
                }

                function onChangeTextHighlight(newValue) {
                    props.setAttributes({ textHighlightEnabled: newValue });
                }

                function onChangeAutoplay(newValue) {
                    props.setAttributes({ autoplay: newValue });
                }

                function onChangeWordbreak(newValue) {
                    props.setAttributes({ defaultWordbreak: newValue });
                }

                function onBgChange(newValue) {
                    props.setAttributes({ backgroundColor: newValue });
                }

                function onTextColorChange(newValue) {
                    props.setAttributes({ textColor: newValue });
                }

                function onFontSizeChange(newValue) {
                    props.setAttributes({ fontSize: newValue });
                }

                function onElementsSelectorChange(newValue) {
                    props.setAttributes({ elementsSelector: newValue });
                }

                function onRootSelectorChange(newValue) {
                    props.setAttributes({ rootSelector: newValue });
                }

                function onPaddingChange(newValue) {
                    props.setAttributes({ padding: newValue });
                }

                function onVoicePickerChange(newValue) {
                    props.setAttributes({ voicePickerEnabled: newValue });
                }

                function onVoiceClassFilterChange(newValue) {
                    props.setAttributes({ voiceClassFilter: newValue });
                }

                function onVoiceLanguageFilterChange(newValue) {
                    props.setAttributes({ voiceLanguageFilter: newValue });
                }

                function onVoiceCultureFilterChange(newValue) {
                    props.setAttributes({ voiceCultureFilter: newValue });
                }

                var placeholderPreview = (props.attributes.controlCenter === "local" || props.attributes.controlCenter === "native") ?
                    el("div", { className: "talkify-local-preview-placeholder" }) :
                    el("div", { className: "talkify-bottom-preview-placeholder" });

                return el(fragment,
                    null,
                    el(inspectorControls,
                        null,
                        el(textbox,
                            {
                                label: 'Button text',
                                value: props.attributes.buttonTextField,
                                onChange: onChangeButtonTextField
                            }
                        ),
                        el(checkboxControl,
                            {
                                label: 'Remove button on click',
                                help: 'Hides the button when playback starts',
                                checked: props.attributes.removeOnclickCheckbox,
                                onChange: onChangeRemoveOnclickCheckboxField
                            }
                        ),
                        el(checkboxControl,
                            {
                                label: 'Autoplay',
                                help: 'Plays automatically, as if the user clicked on the button.',
                                checked: props.attributes.autoplay,
                                onChange: onChangeAutoplay
                            }
                        ),
                        el(wp.components.SelectControl,
                            {
                                label: "Default voice",
                                options: voices,
                                value: props.attributes.defaultVoice,
                                onChange: onChangeDefaultVoice
                            }
                        ),
                        el(wp.components.RangeControl,
                            {
                                label: 'Default speech rate',
                                help: 'A value of 0 indicates normal rate',
                                value: props.attributes.defaultRate,
                                onChange: onChangeDefaultRate,
                                min: -5,
                                max: 5
                            }
                        ),
                        el(wp.components.RangeControl,
                            {
                                label: 'Default speech pitch',
                                help: 'A value of 0 indicates normal pitch',
                                value: props.attributes.defaultPitch,
                                onChange: onChangeDefaultPitch,
                                min: -10,
                                max: 10
                            }
                        ),
                        el(wp.components.RangeControl,
                            {
                                label: 'Default additional break between words',
                                help: 'A value of 0 indicates normal pauses',
                                value: props.attributes.defaultWordbreak,
                                onChange: onChangeWordbreak,
                                min: 0,
                                max: 3000
                            }
                        ),
                        el(checkboxControl,
                            {
                                label: 'Enable text highlight by default',
                                help: 'Text highlight, or speech marks, is when text is highlighted as it is spoken',
                                checked: props.attributes.textHighlightEnabled,
                                onChange: onChangeTextHighlight
                            }
                        ),
                        el(checkboxControl,
                            {
                                label: 'Enable text interaction by default',
                                help: 'A user can click a block of text to listen to it',
                                checked: props.attributes.textInteractionEnabled,
                                onChange: onChangeTextInteration
                            }
                        ),
                        el(wp.components.SelectControl,
                            {
                                label: "Control center (UI theme)",
                                help: "Click on the button in the editor to see appoximate placement.",
                                options: [{ value: 'modern', label: 'Modern - Full width, fixed to bottom of screen' },
                                { value: 'classic', label: 'Classic - Full width, fixed to bottom of screen' },
                                { value: 'local', label: 'Local - Small, inline placement' },
                                { value: 'native', label: 'Browser built in controls' }],
                                value: props.attributes.controlCenter,
                                onChange: onChangeControlCenter
                            }
                        ),
                        el(checkboxControl, {
                            label: 'Enable voice picker',
                            help: 'Lets users select voices via the control center',
                            checked: props.attributes.voicePickerEnabled,
                            disabled: props.attributes.controlCenter === "native" || props.attributes.controlCenter === "local",
                            onChange: onVoicePickerChange
                        }),
                        el(textbox, {
                            label: 'Voice class filter',
                            help: 'Possible values are Standard, Premium, Exclusive and Neural. Empty means all.',
                            placeholder: 'Comma separated, e.g. Standard, Neural',
                            value: props.attributes.voiceClassFilter,
                            disabled: !props.attributes.voicePickerEnabled || (props.attributes.controlCenter === "native" || props.attributes.controlCenter === "local"),
                            onChange: onVoiceClassFilterChange
                        }),
                        el(textbox, {
                            label: 'Voice language filter',
                            help: 'Empty means all.',
                            placeholder: 'Comma separated, e.g. English, German',
                            value: props.attributes.voiceLanguageFilter,
                            disabled: !props.attributes.voicePickerEnabled || (props.attributes.controlCenter === "native" || props.attributes.controlCenter === "local"),
                            onChange: onVoiceLanguageFilterChange
                        }),
                        el(textbox, {
                            label: 'Voice culture filter',
                            help: 'Empty means all',
                            placeholder: 'Comma separated, e.g. en-GB, en-US',
                            value: props.attributes.voiceCultureFilter,
                            disabled: !props.attributes.voicePickerEnabled || (props.attributes.controlCenter === "native" || props.attributes.controlCenter === "local"),
                            onChange: onVoiceCultureFilterChange
                        }),
                        el(textbox, {
                            label: 'HTML container to play',
                            help: '(e.g. ".wrapper") Leave empty for best guess',
                            value: props.attributes.rootSelector,
                            onChange: onRootSelectorChange
                        }),
                        el(textbox, {
                            label: 'HTML elements to play',
                            help: '(e.g. "p.talkify") Only if you have specific elements you want audible',
                            value: props.attributes.elementsSelector,
                            onChange: onElementsSelectorChange
                        }),
                        el(components.ColorPalette, {
                            label: 'Background color',
                            colors: colors,
                            value: props.attributes.backgroundColor,
                            onChange: onBgChange
                        }),
                        el(components.ColorPalette, {
                            label: 'Text color',
                            colors: textColors,
                            value: props.attributes.textColor,
                            onChange: onTextColorChange
                        }),
                        el(components.FontSizePicker, {
                            label: 'Font size',
                            fontSizes: fontSizes,
                            fallbackFontSize: 16,
                            value: props.attributes.fontSize,
                            onChange: onFontSizeChange
                        }),
                        el(textbox, {
                            label: 'Padding',
                            value: props.attributes.padding,
                            onChange: onPaddingChange
                        })
                    ),
                    el(
                        'div',
                        { className: props.className },
                        el('button',
                            {
                                className: "talkify-activate", style: {
                                    'background-color': props.attributes.backgroundColor,
                                    'color': props.attributes.textColor,
                                    'font-size': props.attributes.fontSize,
                                    'padding': props.attributes.padding
                                }
                            }
                            , props.attributes.buttonTextField),
                        placeholderPreview)
                );
            },
            save: function (props) {
                return el('div',
                    {
                        className: props.className + " talkify-controlcenter-placeholder"
                    },
                    el('button', {
                        "data-controlcenter-type": props.attributes.controlCenter,
                        "data-default-rate": props.attributes.defaultRate,
                        "data-default-voice": props.attributes.defaultVoice,
                        "data-remove-on-click": props.attributes.removeOnclickCheckbox ? "true" : "",
                        "data-default-pitch": props.attributes.defaultPitch,
                        "data-default-texthighlight": props.attributes.textHighlightEnabled,
                        "data-default-textinteraction": props.attributes.textInteractionEnabled,
                        "data-autoplay": props.attributes.autoplay,
                        "data-default-wordbreak": props.attributes.defaultWordbreak,
                        "data-root-selector": props.attributes.rootSelector,
                        "data-elements-selector": props.attributes.elementsSelector,
                        "data-voice-picker-enabled": props.attributes.voicePickerEnabled,
                        "data-voice-classfilter": props.attributes.voiceClassFilter,
                        "data-voice-languagefilter": props.attributes.voiceLanguageFilter,
                        "data-voice-culturefilter": props.attributes.voiceCultureFilter,
                        className: "talkify-activate",
                        style: {
                            'background-color': props.attributes.backgroundColor,
                            'color': props.attributes.textColor,
                            'font-size': props.attributes.fontSize,
                            'padding': props.attributes.padding
                        }
                    }, props.attributes.buttonTextField)
                );
            },
        });
    }


})(window.wp.blocks, window.wp.i18n, window.wp.element, window.wp.editor, window.wp.components);