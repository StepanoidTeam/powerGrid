const gulp = require('gulp');

module.exports = gulp.task('build:styles', function () {
	const config = require('../config');
	const debug = require('gulp-debug');
	const gulpIf = require('gulp-if');

	const less = require('gulp-less');
	const concat = require('gulp-concat');
	const sourcemaps = require('gulp-sourcemaps');

	const plumber = require('gulp-plumber');
	
	return gulp.src(config.tasks.styles.src)
		.pipe(gulpIf(config.debug, plumber()))
		.pipe(gulpIf(config.debug, debug({title: 'src'})))
		.pipe(gulpIf(config.debug, sourcemaps.init()))
		.pipe(concat(config.tasks.styles.dest))
		.pipe(less())
		.pipe(gulpIf(config.debug, sourcemaps.write()))
		.pipe(gulp.dest(config.root.dest));

});
