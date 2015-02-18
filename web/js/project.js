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
var KeyIterator = new Class({
    keyRange: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
    startKey:'C',
    index: 0,
    octave: 0,

    initialize: function ( startKey ) {
        this.index = this.findStartIndex(startKey);
    },

    findStartIndex: function ( startKey ) {
        var index;
        for ( index = 0; index < this.keyRange.length; index +=1 ) {
            if (this.keyRange[index] === startKey) {
                return index;
            }
        }
        throw "Start key value not found";
    }.protect(),

    setStartKey: function ( key ) {
        this.startKey;
    }.protect(),

    formatDisplayValue: function ( key ) {
        var displayValue;
        if ( this.octave !== 0 )  {
            displayValue = key[0] + this.octave;
        }

        if ( this.octave === 0 ) {
            displayValue = key[0];
        }

        if ( typeof key[1] !== 'undefined' ) {
            displayValue = displayValue + key[1];
        }

        return displayValue;
    }.protect(),

    getCurrent: function () {
        return this.formatDisplayValue(this.keyRange[this.index]);
    },

    next: function () {
        if ( this.index + 1 >= this.keyRange.length ) {
            this.index = 0;
            this.octave += 1;
            return;
        }
        this.index += 1;
    },

    previous: function () {
        if (this.index === 0) {
            this.index = this.keyRange.length;
            this.octave -= 1;
            return;
        }
        this.index -= 1;
    }
});
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

var RandomIntervalPlayer = new Class({
    lastInterval: null,
    initialize: function ( element ) {
        $('random-interval').addEvent('click', function () {
            var interval = this.getRandomInterval(),
                keys = $$('div.anchor');
            keys[interval.startValue].click();
            keys[interval.endValue].click();

            this.lastInterval = interval;
            console.log(this.getInterValByKeyElements(keys[interval.startValue], keys[interval.endValue]));
            setTimeout(function(){ keys[interval.startValue].click() }, 1000);
            setTimeout(function(){ keys[interval.endValue].click() }, 1300);

            setTimeout(function(){ keys[interval.startValue].click() }, 2000);
            setTimeout(function(){ keys[interval.endValue].click() }, 2300);
        }.bind(this));

        $('random-interval-last').addEvent('click', function () {
            var interval = this.lastInterval,
                keys = $$('div.anchor');
            keys[interval.startValue].click();
            keys[interval.endValue].click();

            this.lastIntervalKeys = keys;
            console.log(this.getInterValByKeyElements(keys[interval.startValue], keys[interval.endValue]));
            setTimeout(function(){ keys[interval.startValue].click() }, 1000);
            setTimeout(function(){ keys[interval.endValue].click() }, 1300);

            setTimeout(function(){ keys[interval.startValue].click() }, 2000);
            setTimeout(function(){ keys[interval.endValue].click() }, 2300);
        }.bind(this));
    },
    getInterValByKeyElements: function (firstKey, secondKey) {
        var firstNote = firstKey.get('class').replace('anchor ', ''),
            secondNote = secondKey.get('class').replace('anchor ', ''),

            firstMidiNote = new MidiNote(firstNote).getNoteNumber(),
            secondMidiNote = new MidiNote(secondNote).getNoteNumber();
        return this.calculateInterval( {startValue: firstMidiNote, endValue: secondMidiNote});
    },
    getRandomInterval: function () {
        var aAndC = [19,21]
            startValue = aAndC[Math.floor(Math.random() * aAndC.length)],
            endValue = Math.floor((Math.random() * 7) + startValue + 1);
        return {
            startValue: startValue,
            endValue: endValue
        }
    },
    randomIntFromInterval: function(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    },
    calculateInterval: function ( interval) {
        var distance = interval.endValue - interval.startValue,
            intervalName = '';

        switch (distance) {
            case  1:  intervalName = 'minor 2nd'
                break;
            case 2: intervalName = 'major 2nd'
                break;
            case 3: intervalName = 'minor 3rd'
                break;
            case 4: intervalName = 'major 3rd'
                break;
            case 5: intervalName = 'perfect 4th'
                break;

            case 6: intervalName = 'perfect 5th'
                break;

            case 7: intervalName = 'tritone'
                break;

            case 8: intervalName = 'minor 6th'
                break;

            case 9: intervalName = 'major 6th'
                break;

            case 10: intervalName = 'minor 7th'
                break;

            case 11: intervalName = 'major 7th'
                break;

            case 12: intervalName = 'octave'
                break;

        }
        return intervalName;
    }

});