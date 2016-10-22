'use strict';

var componentController = function (authService) {
	var ctrl = this;

	ctrl.username = '';
	ctrl.password = '';


	ctrl.$routerOnActivate = function (next) {
		console.log(next);
	};


	ctrl.usernameChanged = function (value) {
		ctrl.username = value;
	};

	ctrl.passwordChanged = function (value) {
		ctrl.password = value;
	};


	ctrl.logIn = function () {
		authService.logIn(ctrl.username, ctrl.password);

		
	}


};
angular.module('auth')
    .component('login', {
    	bindings: {
    		//some login callbacks
    	},
    	templateUrl: 'app/auth/login/login.html',
    	controller: componentController
    })

;