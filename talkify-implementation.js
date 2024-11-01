function getFilter(input) {
    return input.split(",").map(function (item) {
        return item.trim();
    }).filter(function (x) {
        return !!x;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var player, playlist;

    talkify.config.remoteService.apiKey = window.talkifyplugin.apiKey;
    talkify.config.remoteService.active = true;

    talkify.config.keyboardCommands.enabled = window.talkifyplugin.useKeyboardCommands === "1";
    talkify.config.voiceCommands.enabled = window.talkifyplugin.useVoiceCommands === "1";
    talkify.config.maximumTextLength = parseInt(window.talkifyplugin.maximumRequestSize) || talkify.config.maximumTextLength;

    talkify.config.ui.audioControls.enabled = true;

    talkify.config.useSsml = false;

    var button = document.querySelectorAll(".talkify-activate");

    if (button.length) {
        button.forEach(function (b) {
            b.addEventListener("click", function () {
                var me = this;
                var initialStyle = this.style.display;

                if (player) {
                    player.dispose();
                }

                if (playlist) {
                    playlist.dispose();
                }

                var rootElement, rootSelector;
                var specificElements = [];

                if (this.getAttribute('data-root-selector')) {
                    rootElement = document.querySelector(this.getAttribute('data-root-selector'));
                } else {
                    rootElement = this.parentElement.parentElement;
                }

                if (this.getAttribute('data-elements-selector')) {
                    specificElements = document.querySelectorAll(this.getAttribute('data-elements-selector'));
                }

                if (!rootElement && !specificElements.length) {
                    specificElements = document.querySelectorAll('p');
                }

                if (rootElement) {
                    rootElement.classList.add("talkify-root")
                }

                var controlcentertype = this.getAttribute('data-controlcenter-type');
                var rate = this.getAttribute('data-default-rate');
                var voice = this.getAttribute('data-default-voice');
                var pitch = this.getAttribute('data-default-pitch');
                var wordbreak = this.getAttribute('data-default-wordbreak');
                var texthighlight = this.getAttribute('data-default-texthighlight') === "true";
                var textinteraction = this.getAttribute('data-default-textinteraction') === "true";
                var removeOnClick = this.getAttribute('data-remove-on-click');
                var voicePickerEnabled = this.getAttribute('data-voice-picker-enabled') === "true";
                var voiceClassFilter = this.getAttribute('data-voice-classfilter') || "";
                var voiceLanguageFilter = this.getAttribute('data-voice-languagefilter') || "";
                var voiceCultureFilter = this.getAttribute('data-voice-culturefilter') || "";

                var controlcenterPlaceholder = controlcentertype === "local" || controlcentertype === "native" ? this.parentElement : document.body;

                talkify.config.ui.audioControls.controlcenter = controlcentertype || window.talkifyplugin.controlcenter;
                talkify.config.ui.audioControls.container = controlcenterPlaceholder;
                talkify.config.ui.audioControls.voicepicker.enabled = voicePickerEnabled;
                talkify.config.ui.audioControls.voicepicker.filter.byClass = getFilter(voiceClassFilter);
                talkify.config.ui.audioControls.voicepicker.filter.byLanguage = getFilter(voiceLanguageFilter);
                talkify.config.ui.audioControls.voicepicker.filter.byCulture = getFilter(voiceCultureFilter);


                player = new talkify.TtsPlayer().enableTextHighlighting();

                player.forceVoice({ name: voice || window.talkifyplugin.defaultVoice || "David" });
                player.setRate(parseInt(rate) || parseInt(window.talkifyplugin.defaultRate) || 0);
                player.usePitch(parseInt(pitch) || 0);
                player.useWordBreak(parseInt(wordbreak) || 0);

                if (texthighlight) {
                    player.enableTextHighlighting();
                } else {
                    player.disableTextHighlighting();
                }

                playlist = new talkify.playlist()
                    .begin()
                    .usingPlayer(player);

                if (specificElements.length) {
                    playlist.withElements(specificElements);
                } else {
                    playlist.withRootSelector(".talkify-root");
                }

                if (textinteraction) {
                    playlist.withTextInteraction();
                }

                playlist.subscribeTo({
                    onEnded: function () {
                        me.style.display = initialStyle;
                        player.dispose();
                        playlist.dispose();
                    }
                });

                playlist = playlist.build();

                playlist.play();

                if (removeOnClick) {
                    this.style.display = "none";
                }
            });

            var autoplay = b.getAttribute('data-autoplay') === "true";

            if (autoplay) {
                b.click();
            }
        })
    }
});