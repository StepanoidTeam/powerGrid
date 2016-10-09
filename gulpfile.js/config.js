/* CONFIG */

var env = process.env.NODE_ENV || 'development';
var production = env === 'production';

const path = require('path');
const rootSrc = './app';
const libSrc = './libs';
const assetsSrc = './assets';
const rootDest = './dest';

const config = {
	'root': {
		'src': rootSrc,
		'dest': rootDest,
	},
	'tasks': {
		'scripts': {
			'src': [
				path.join(libSrc, 'jquery-*.js'), 
				path.join(libSrc, '/**/*.js'),  
				path.join(rootSrc, 'app.js'), 
				path.join(rootSrc, '/**/*.js')],
			'dest': 'scripts.js'
		},
		'styles': {
			'src': [ 
				path.join(assetsSrc, '**/*.{less,css}'),
				path.join(libSrc, '**/*.{less,css}'),
				path.join(rootSrc, '**/*.{less,css}')],
			'dest': 'styles.css',
		},
		'templates': {
			'src': path.join(rootSrc, '/**/*.html'),
			'dest': rootDest,
			'excludeFolders': []
		},
		'clean': {
			'src': path.join(rootDest, '/*'),
		},
		'watch': {
			'scripts': path.join(rootSrc, '/**/*.js'),
			'styles': path.join(rootSrc, '**/*.{less,css}'),
			'templates': path.join(rootSrc, '**/*.{html}'),
		}
	},
	'production': production,
	'debug': !production,
};

module.exports = config;