'use strict';

angular.module('auth')
	.controller('authCheck', function (authService, $location) {

		authService.getPlayerStatus().then(function (user) {
			console.log('auth check ok', user);
		}, function (error) {
			console.log('auth check bad', error);
			$location.path('/init');
		});


	});
