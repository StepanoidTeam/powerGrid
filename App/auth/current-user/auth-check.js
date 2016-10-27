'use strict';

angular.module('auth')
	.controller('authCheck', function (authService, $location) {
		
		//todo: 
		// 1. get cookies user
		// 2. sent to serv to check
		// 3. redir on fail
		

		authService.checkAuth().then(function (user) {
			console.log('auth check ok', user);
		}, function (error) {
			console.log('auth check bad', error);
			$location.path('/login');
		});
	});