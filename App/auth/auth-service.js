'use strict';

angular.module('auth', [])
.service('authService', function ($q, apiEndpoints) {
	var svc = this;
	
	svc.login = function (user) {
		return apiEndpoints.login(user).then(function () {

		}).catch(function (error) {
			//error on login
			return svc.logout();
		});
	};

	svc.logout = apiEndpoints.logout;

	svc.register = function (username, password) {

	};

	svc.getPlayerStatus = apiEndpoints.getPlayerStatus;

});