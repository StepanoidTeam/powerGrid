const gulp = require('gulp');

module.exports = gulp.task('build:clean', function () {
	const config = require('../config');
	const del = require('del');	
	
	return del(config.tasks.clean.src);
});