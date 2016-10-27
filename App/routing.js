﻿angular.module('routing', ['ngRoute'])

.config(function ($locationProvider) {
	$locationProvider.html5Mode(false);
	//$locationProvider.hashPrefix('!');
})
.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			redirectTo: '/rooms',
		})
		//.when('/inbox', {
		//	template: '<inbox mails="$resolve.mails"></inbox>',
		//	resolve: { mails: function (Mails) { return Mails.fetch(); } }
		//})
		.when('/login', {
			template: '<login></login>',
		})
		.when('/rooms', {
			template: '<room-list></room-list>',
		})
		.when('/rooms/:id', {
			template: '<room room-id="$resolve.roomId"></room>',
			resolve: {
				roomId: function ($route) {
					return $route.current.params.id;
				},
			}
		})
		.when('/404', {
			templateUrl: 'app/404.html',
		})
		.otherwise({
			redirectTo: '/404'
		});

});
