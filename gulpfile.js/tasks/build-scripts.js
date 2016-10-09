const gulp = require('gulp');

module.exports = gulp.task('build:scripts', function () {
    const config = require('../config');
    const debug = require('gulp-debug');
    const gulpIf = require('gulp-if');

    const concat = require('gulp-concat');
    const sourcemaps = require('gulp-sourcemaps');

    const plumber = require('gulp-plumber');

    gulp.src(config.tasks.scripts.src)
        .pipe(gulpIf(config.debug, plumber()))
        .pipe(gulpIf(config.debug, debug({ title: 'src' })))
        .pipe(gulpIf(config.debug, sourcemaps.init()))
        .pipe(concat(config.tasks.scripts.dest))
        .pipe(gulpIf(config.debug, sourcemaps.write()))
        .pipe(gulp.dest(config.root.dest));
});