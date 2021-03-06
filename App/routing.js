﻿angular.module('routing', ['ngRoute'])

	.config(function ($locationProvider) {
		$locationProvider.html5Mode(false);
		//$locationProvider.hashPrefix('!');
	})

	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {redirectTo: '/init'})
			.when('/init', {template: '<init></init>'})
			.when('/login', {template: '<login></login>'})
			.when('/ROOM/List', {template: '<room-list></room-list>'})
			.when('/ROOM/current', {template: '<room></room>'})
			.when('/game', {template: '<game></game>'})
			.when('/404', {templateUrl: 'app/404.html'})
			.when('/error', {templateUrl: 'app/error.html'})
			.otherwise({redirectTo: '/404'});

	});
