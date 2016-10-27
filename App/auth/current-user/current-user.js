'use strict';

var componentController = function (authService) {
	var ctrl = this;

	ctrl.isAuthorized = authService.isAuthorized;

	ctrl.profile = authService.profile;
};

angular.module('auth')
	.component('currentUser', {
		bindings: {
		},
		templateUrl: 'app/auth/current-user/current-user.html',
		controller: componentController
	});