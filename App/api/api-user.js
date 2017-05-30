'use strict';

angular.module('app')
	.service('apiUser', function (apiEndpoints, apiWsEndpoints) {
		const svc = this;

		const wsUser = apiWsEndpoints.wsMessage.filter(msg => msg.EntityType === 'User');

		//any user
		svc.onLogin = wsUser.filter(msg => msg.BroadcastReason === '/api/USER/Login');
		svc.onLogout = wsUser.filter(msg => msg.BroadcastReason === 'api/User/Logout');


		//todo: move here all user related methods
	});
