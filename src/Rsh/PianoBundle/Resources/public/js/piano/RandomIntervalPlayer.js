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