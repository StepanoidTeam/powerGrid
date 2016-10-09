const gulp = require('gulp');

module.exports = gulp.task('build', ['build:clean', 'build:scripts', 'build:styles', 'build:templates']);