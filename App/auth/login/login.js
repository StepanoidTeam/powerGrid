'use strict';

var componentController = function ($location, authService) {
	var ctrl = this;

	ctrl.userData = { username: '', password: '' };


	ctrl.usernameChanged = function (value) {
		ctrl.userData.username = value;
	};

	ctrl.passwordChanged = function (value) {
		ctrl.userData.password = value;
	};


	ctrl.login = function () {
		authService.login(ctrl.userData).then(function () {
			$location.path('/');
		}, function () {
			console.warn('login failed');
		});
	}

};

angular.module('auth')
	.component('login', {
		bindings: {
			//some login callbacks
		},
		templateUrl: 'app/auth/login/login.html',
		controller: componentController
	});