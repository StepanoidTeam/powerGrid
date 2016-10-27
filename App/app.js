'use strict';

//'routing', 'ngCookies',
angular.module('app', [
	'ngCookies',
	'routing',
	'rooms',
	'auth'
])

.run(function () {
	//init stuff goes here
	console.log('app.js init from ng');
})

.component('app', {
	templateUrl: 'app/app.html',
});


angular.module('app').config(function ($httpProvider) {
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
});