var HtmlKeyboard = new Class({
    containerElement: {},

    initialize: function ( element ) {
        this.containerElement = $( element );
        this.setKeyNames();
        this.setKeyEvents();
    },
    setKeyNames: function () {
        var keyIterator = new KeyIterator('C'),
            whiteKeyContainerElements = this.containerElement.getChildren('>li');

        whiteKeyContainerElements.each( function( whiteKeyContainerElement ) {
            whiteKeyContainerElement.getFirst('div').addClass(keyIterator.getCurrent());
            keyIterator.next();

            var blackKey = this.getBlackKeyElement( whiteKeyContainerElement );
            if ( blackKey !== null ) {
                blackKey.addClass(keyIterator.getCurrent());
                keyIterator.next();
            }
        }.bind( this ));

    }.protect(),

    getBlackKeyElement: function ( whiteKeyContainerElement ) {
        var sibling = whiteKeyContainerElement.getNext();
        if (sibling === null) {
            return null;
        }
        return sibling.getFirst('span');

    }.protect(),

    setKeyEvents: function () {
        var keyElements = this.containerElement.getChildren('li, span');
        keyElements.each( function( keyElement ) {
            keyElement.addEvent('click', function ( event ) {
                var noteStringValue = event.target.get('class').replace('anchor ', '');
                var delay = 0; // play one note every quarter second
                var note = 31; // the MIDI note
                var velocity = 127; // how hard the note hits


                var midiNote = new MidiNote( noteStringValue );
                console.log(noteStringValue);

                // play the note
                MIDI.setVolume(0, 127);
                MIDI.noteOn(0, midiNote.getNoteNumber(), velocity, delay);
                MIDI.noteOff(0, midiNote.getNoteNumber(), delay + 0.75);

            });
        }.bind( this ));
    }.protect()
});