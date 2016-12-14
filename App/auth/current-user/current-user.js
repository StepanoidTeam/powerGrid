'use strict';

var componentController = function ($q, $location, authService) {
	var ctrl = this;

	var isAuth = false;
	ctrl.isAuthorized = function () {
		return isAuth;
	};

	ctrl.logout = function () {
		authService.logout().then(function () {
			$location.path('/login');
		});
	};


	// debug
	

	//$q.all([, authService.getPlayerStatus()]).then

	authService.getPlayerStatus()
		//.then(authService.getPlayerStatus)
		.then(function (player) {
			ctrl.userName = player.Name;
			isAuth = true;
		}).catch(function () {
			isAuth = false;
		});

};

angular.module('auth')
	.component('currentUser', {
		bindings: {
		},
		templateUrl: 'app/auth/current-user/current-user.html',
		controller: componentController
	});