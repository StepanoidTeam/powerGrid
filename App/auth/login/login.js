'use strict';

var componentController = function ($location, authService) {
	var ctrl = this;

	ctrl.username = '';
	ctrl.password = '';


	ctrl.usernameChanged = function (value) {
		ctrl.username = value;
	};

	ctrl.passwordChanged = function (value) {
		ctrl.password = value;
	};


	ctrl.logIn = function () {
		authService.logIn(ctrl.username, ctrl.password).then(function () {
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