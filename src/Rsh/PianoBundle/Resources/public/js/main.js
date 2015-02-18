window.addEvent('domready', function () {
    var htmlKeyboard = new HtmlKeyboard('piano');

    MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano",
        callback: function() {
        }
    });

    new RandomIntervalPlayer();
});