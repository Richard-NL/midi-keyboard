var gulp = require('gulp'),
	copy = require('gulp-copy'),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	watch = require('gulp-watch');

var paths = {
	source: {
		css: ['src/Rsh/AdventureBundle/Resources/public/css/main.css'],
		js: {
			mootools: [
				'bower_components/mootools/dist/mootools-core.js'
			],
			project: ['src/Rsh/PianoBundle/Resources/public/js/main.js', 'src/Rsh/PianoBundle/Resources/public/js/piano/*.js']
		}
	},
	public: {
		css: 'web/css',
		js:  'web/js'
	}
}
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

// Delete the public web css and js directory
gulp.task('clean', function () {
	return gulp.src([paths.public.js])
		.pipe(clean());
});


// copy files to web/js and web/css
gulp.task('build', ['clean'], function () {
    var projectResourcePath = 'src/Rsh/PianoBundle/Resources/public/js',
        publicJsPath = paths.public.js;

    var midiJsFiles = [
            'src/Rsh/PianoBundle/Resources/public/js/MIDI/AudioDetect.js',
            'src/Rsh/PianoBundle/Resources/public/js/MIDI/LoadPlugin.js',
            'src/Rsh/PianoBundle/Resources/public/js/MIDI/Player.js',
            'src/Rsh/PianoBundle/Resources/public/js/MIDI/Plugin.js'];

    gulp.src(['src/Rsh/PianoBundle/Resources/public/js/Window/DOMLoader.XMLHttp.js'])
        .pipe(gulp.dest(paths.public.js + '/Window'));

    gulp.src(midiJsFiles)
        .pipe(gulp.dest(paths.public.js + '/MIDI'));



	gulp.src(paths.source.js.mootools)
		.pipe(concat('mootools.libs.js'))
		.pipe(gulp.dest(paths.public.js));

	gulp.src(paths.source.js.project)
		.pipe(concat('project.js'))
		.pipe(gulp.dest(paths.public.js));
});

gulp.task('watch', function () {
	watch(['src/Rsh/PianoBundle/Resources/public/js/*.js','src/Rsh/PianoBundle/Resources/public/js/piano/*.js'], function () {
		gulp.start('build');
	});
});

gulp.task('default', ['build', 'watch'], function () {
	console.log('Default task');
});