const gulp = require('gulp');

gulp.task('watch:scripts', function () {
	const config = require('../config');
	gulp.watch(config.tasks.scripts.src, ['build:scripts']);
});

gulp.task('watch:styles', function () {
	const config = require('../config');
	gulp.watch(config.tasks.styles.src, ['build:styles']);
});

gulp.task('watch:templates', function () {
	const config = require('../config');
	gulp.watch(config.tasks.templates.src, ['build:templates']);
});

module.exports = gulp.task('watch', ['build', 'watch:scripts', 'watch:styles', 'watch:templates']);