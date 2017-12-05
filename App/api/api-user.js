'use strict';

angular.module('app')
	.service('apiUser', function (apiEndpoints, apiWsEndpoints, wsFilter) {
		const svc = this;

		const wsUser = apiWsEndpoints.wsMessage.filter(wsFilter.Type.User);

		//any user
		svc.onLogin = wsUser.filter(wsFilter.Auth.Login);
		svc.onLogout = wsUser.filter(wsFilter.Auth.Logout);


		//todo: move here all user related methods
	});
