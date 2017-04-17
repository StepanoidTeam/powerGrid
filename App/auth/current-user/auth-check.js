'use strict';

angular.module('auth')
	.controller('authCheck', function (authService, $location) {
		authService.getPlayerStatus().catch(function (error) {
			console.log('auth check bad', error);
			$location.path('/init');
		});
	});
