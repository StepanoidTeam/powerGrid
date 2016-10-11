const gulp = require('gulp');

module.exports = gulp.task('build:templates', function () {
	const config = require('../config');
	const debug = require('gulp-debug');
	const gulpIf = require('gulp-if');
	
	const html2js = require('gulp-html2js');
	const concat = require('gulp-concat');
	
	gulp.src(config.tasks.templates.src)
		.pipe(gulpIf(config.debug, debug({title: 'src'})))
		.pipe(html2js({
			outputModuleName: config.appName,
			useStrict: true
		}))
		.pipe(concat('templates.js'))
		.pipe(gulp.dest(config.root.dest));
});
