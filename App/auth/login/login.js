'use strict';

var componentController = function ($location, authService, apiWsEndpoints) {
	const ctrl = this;

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}


	var playerNamesStub = ['bob', 'igor', 'admin4eg', 'johnDoe', 'gnome', 'qwerty', 'uzerok']
	var randUserName = playerNamesStub[getRandomInt(playerNamesStub.length)] + getRandomInt(100);

	ctrl.userData = {username: randUserName, password: '123'};

	ctrl.usernameChanged = function (value) {
		ctrl.userData.username = value;
	};

	ctrl.passwordChanged = function (value) {
		ctrl.userData.password = value;
	};

	ctrl.login = function () {
		authService.login(ctrl.userData).then(function () {
			$location.path('/rooms');
		});
	};


};

angular.module('auth')
	.component('login', {
		bindings: {
			//some login callbacks
		},
		templateUrl: 'app/auth/login/login.html',
		controller: componentController
	});
