'use strict';

var componentController = function ($location, authService) {
	const ctrl = this;

	let isAuth = false;
	ctrl.isAuthorized = () => isAuth;

	ctrl.logout = () => authService.logout();

	ctrl.$onInit = function () {
		authService.player.subscribe(player => {
			if (player) {
				ctrl.userName = player.Name;
				isAuth = true;
			} else {
				isAuth = false;
			}
		});
	};
};

angular.module('auth')
	.component('currentUser', {
		bindings: {},
		templateUrl: 'app/auth/current-user/current-user.html',
		controller: componentController
	});
