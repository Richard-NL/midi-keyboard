var MidiNote = new Class({
    noteNumber: null,
    isSharp: false,
    plainNote: '',
    octave: null,
    keyRange: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
    initialize: function ( note ) {
        this.octave = this.extractOctave( note );
        this.isSharp = this.extractIsSharpStatus( note );
        this.plainNote = this.extractNoteStatus( note );
        this.noteNumber = this.calculateMidiNoteNumber( note );
    },

    getNoteNumber: function () {
        return this.noteNumber;
    },

    calculateMidiNoteNumber: function ( note ) {
        var index,
            noteWithoutOctave = this.extractNoteStatus( note),
            octave = this.extractOctave( note );
        if (this.extractIsSharpStatus( note )) {
            noteWithoutOctave += '#';
        }

        for ( index = 0; index < this.keyRange.length; index += 1) {
            if (this.keyRange[index] === noteWithoutOctave) {
                break;
            }
        }
        return index + 21 + octave * 12;
    }.protect(),

    extractOctave: function ( note ) {
        if ( note.length === 1 ) {
            return 0;
        }

        if ( note[1] === '#' && note.length === 2)  {
            return 0;
        }
        var pattern = /[0-9]/;

        if ( note[1] !== '#' && note.length >= 2 && pattern.test(note[1])) {
            return parseInt(note[1]);
        }

        throw "No octave found";
    }.protect(),

    extractNoteStatus: function ( note ) {
        return note[0];
    }.protect(),

    extractIsSharpStatus: function ( note) {
        if ( note.length === 1 ) {
            return false;
        }

        if ( note[1] !== '#' && note.length === 2 ) {
            return false;
        }

        if ( note[1] === '#' && note.length === 2 ) {
            return true;
        }

        if ( note[2] === '#' && note.length === 3 ) {
            return true;
        }
        throw "Invalid note";
    }.protect()

});
