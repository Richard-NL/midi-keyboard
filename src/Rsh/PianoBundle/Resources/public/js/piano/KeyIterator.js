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