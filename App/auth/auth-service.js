'use strict';

angular.module('auth', [])
.service('authService', function ($q, apiEndpoints, chatService) {
	var svc = this;

	svc.login = function (userData) {
		return apiEndpoints.login(userData).then(function (data) {

			chatService.sendMessage(`${userData.username} user logined`);

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