'use strict';

//'routing', 'ngCookies',
angular.module('app', [
	'ngComponentRouter',
	'heroes',
	//'login',
	'auth',
])
	.config(function ($locationProvider) {
		$locationProvider.html5Mode(false);
	})
	.value('$routerRootComponent', 'app')
		.run(function () {
			//init stuff goes here
			console.log('app.js init from ng');
		})
	.component('app', {
		templateUrl: 'app/app.html',

		$routeConfig: [
			//{ path: '/crisis-center/...', name: 'CrisisCenter', component: 'crisisCenter', useAsDefault: true },
			{ path: '/heroes/...', name: 'Heroes', component: 'heroes' },

			{ path: '/auth/...', name: 'Auth', component: 'auth', useAsDefault: true },
				//{ path: '/login', name: 'Login', component: 'login', useAsDefault: true },
				//{path: '/:id', name: 'HeroDetail', component: 'heroDetail'}
		]
	});


angular.module('app').config(['$httpProvider', function ($httpProvider) {
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);